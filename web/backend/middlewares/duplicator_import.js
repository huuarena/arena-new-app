import StoreSettingMiddleware from './store_setting.js'
import DuplicatorActions from './duplicator_actions.js'
import csvtojson from 'csvtojson'
import DuplicatorPackageMiddleware from './duplicator_package.js'
import ThemeMiddleware from './theme.js'
import AdminZipMiddleware from './adm_zip.js'
import themekit from '@shopify/themekit'
import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import themeKit from '@shopify/themekit'
import GraphqlFileMiddleware from './graphql_file.js'
import revertData from './duplicator_revert_data.js'
import createData from './duplicator_create_data.js'
import BackgroundJobMiddleware from './background_job.js'
import UniqueCodeMiddleware from './unique_code.js'
import DuplicatorMiddleware from './duplicator.js'

const LIMIT_FOR_PROGRESS = 10

const importTheme = async ({
  shop,
  accessToken,
  backgroundJob,
  uniqueCode,
  duplicatorStore,
  duplicatorPackage,
  version,
  retried,
}) => {
  try {
    let result = [{ type: 'theme', result: [] }]

    const { themeId, themeName, themeRole } = backgroundJob.data

    let cwd = './temp'
    let rootDir = themeId

    let zipFilepath = `${cwd}/${rootDir}.zip`

    let theme = null

    if (!themeId && !themeName) {
      throw new Error('Theme name cannot be blank to import new theme')
    }

    if (themeId) {
      /**
       * Deploy exist theme
       */

      theme = await ThemeMiddleware.findById({ shop, accessToken, id: themeId })
        .then((res) => res.theme)
        .catch((err) => {
          throw new Error('Theme not found')
        })
      console.log('theme :>> ', theme)

      let config = `${theme.role === 'main' ? 'production:' : 'development:'}
        password: ${accessToken}
        theme_id: "${themeId}"
        store: ${shop}`
      console.log('theme kit config :>> ', config)

      // download
      const buffer = await DuplicatorActions.download(version.result.Location)

      // read files
      let zip = new AdmZip(buffer)
      let files = zip.getEntries() // an array of ZipEntry records
      files = files.map((item) => {
        const file = item.toJSON()
        const content = zip.readAsText(item)

        return { filepath: item.entryName, filename: item.name, content }
      })

      // create zip file
      await AdminZipMiddleware.create(zipFilepath)

      // add file into zip file
      for (let i = 0; i < files.length; i++) {
        let { filepath, filename, content } = files[i]

        await AdminZipMiddleware.update(zipFilepath, [{ filename: filepath, content }])
      }

      // extract zip file
      await AdminZipMiddleware.extract(zipFilepath, '')

      // create theme kit config file
      await fs.writeFileSync(`${cwd}/${rootDir}/config.yml`, config, 'utf8')

      // deploy theme
      await themekit.command(
        'deploy',
        {
          env: theme.role === 'main' ? 'production' : 'development',
          allowLive: theme.role === 'main' ? true : false,
        },
        {
          cwd: `${zipFilepath.replace('.zip', '')}`,
        }
      )
    } else {
      /**
       * Create new theme
       */

      let role = themeRole ? themeRole : uniqueCode.permission === 'ALL' ? 'unpublished' : 'demo'

      theme = await ThemeMiddleware.create({
        shop,
        accessToken,
        data: { theme: { name: themeName, src: version.result.Location, role } },
      })
        .then((res) => res.theme)
        .catch((err) => {
          throw new Error(`Create new theme failed: ${err.message}`)
        })
    }

    result[0].theme = theme

    return result
  } catch (error) {
    console.log('importTheme error :>> ', error)

    if (retried === undefined && backgroundJob.data.themeId) {
      return await importTheme({
        shop,
        accessToken,
        backgroundJob,
        uniqueCode,
        duplicatorStore,
        duplicatorPackage,
        version,
        retried: false,
      })
    } else {
      throw new Error(
        error.message ||
          'Has an error occurred while importing theme. Check theme setting and try again'
      )
    }
  }
}

const importFiles = async ({ shop, accessToken, backgroundJob, duplicatorPackage, version }) => {
  try {
    let result = [{ type: 'file', result: [] }]

    let cwd = './temp'
    let rootDir = `p_${duplicatorPackage.id}`
    let subDir = `v_${version.id}`

    // download
    const buffer = await DuplicatorActions.download(version.result.Location)

    // create directory
    if (!fs.existsSync(`${cwd}/${rootDir}`)) {
      await fs.mkdirSync(`${cwd}/${rootDir}`)
    }
    if (!fs.existsSync(`${cwd}/${rootDir}/${subDir}`)) {
      await fs.mkdirSync(`${cwd}/${rootDir}/${subDir}`)
    }

    // download and create file
    let filepath = `${cwd}/${rootDir}/${subDir}/files.csv`
    let content = await DuplicatorActions.download(version.result.Location)
    await fs.writeFileSync(filepath, content)

    // read file
    let csvContent = await fs.readFileSync(filepath, 'utf8')

    // convert csv content to json data
    let jsonData = await csvtojson().fromString(csvContent)
    console.log(`total import files ${jsonData.length}`)

    console.log(`creating files...`)
    for (let i = 0, leng = Math.ceil(jsonData.length / LIMIT_FOR_PROGRESS); i < leng; i++) {
      console.log(`\t [${i + 1}/${leng}] run`)

      let _jsonData = jsonData.slice(i * LIMIT_FOR_PROGRESS, (i + 1) * LIMIT_FOR_PROGRESS)

      for (let j = 0, jleng = _jsonData.length; j < jleng; j++) {
        console.log(`\t\t [${j + 1}/${jleng}] run`)

        await GraphqlFileMiddleware.create({
          shop,
          accessToken,
          variables: {
            files: {
              alt: _jsonData[j].alt,
              contentType: _jsonData[j].contentType,
              originalSource: _jsonData[j].newSource,
            },
          },
        })
          .then((res) => {
            console.log(`\t\t\t file created ${res.id}`)
            result[0].result.push({ success: true, id: res.id })
          })
          .catch((err) => {
            console.log(`\t\t\t create file failed: ${err.message}`)
            result[0].result.push({ success: false, id: _jsonData[j].id, message: err.message })
          })

        console.log(`\t\t [${j + 1}/${jleng}] completed`)
      }

      console.log(`\t [${i + 1}/${leng}] completed`)

      let progress = Math.ceil(((i + 1) / leng) * 100)

      // update backgroundJob
      backgroundJob = await BackgroundJobMiddleware.update(backgroundJob.id, { progress })
    }

    console.table(result[0].result)

    return result
  } catch (error) {
    console.log('importFiles error :>> ', error)
    throw error
  }
}

const importCommon = async ({
  shop,
  accessToken,
  backgroundJob,
  duplicatorStore,
  duplicatorPackage,
  version,
}) => {
  try {
    // download and unzip files
    console.log(`downloading and unziping...`)
    const downloaded = await DuplicatorActions.downloadAndUnzipFile(version.result.Location)
    let files = downloaded.files

    console.log(
      `files:`,
      files.map((file) => file.name)
    )

    // filter import resources
    if (backgroundJob.data.resources?.length > 0) {
      console.log(`filtering import resources...`)
      let _files = []
      for (let i = 0; i < files.length; i++) {
        for (let j = 0; j < backgroundJob.data.resources.length; j++) {
          if (files[i].name.includes(backgroundJob.data.resources[j])) {
            _files.push(files[i])
          }
        }
      }
      files = _files

      console.log(
        `files:`,
        files.map((file) => file.name)
      )
    }

    let result = files.map((file) => ({ type: file.type, result: [] }))

    for (let ii = 0, iileng = files.length; ii < iileng; ii++) {
      console.log(`[${ii + 1}/${iileng}] run`)

      const { type, content } = files[ii]

      // convert csv content to json data
      let jsonData = await csvtojson().fromString(content)
      console.log(`total json data ${jsonData.length}`)

      // revert json data to entry
      let resources = revertData(type, duplicatorStore.shop, jsonData)
      console.log(`total resources ${resources.length}`)

      let productsWithOriginMetafields = []
      if (type === 'custom_collection') {
        productsWithOriginMetafields = await DuplicatorActions.getProductsWithOriginMetafields({
          shop,
          accessToken,
        })
      }

      for (let i = 0, leng = Math.ceil(resources.length / LIMIT_FOR_PROGRESS); i < leng; i++) {
        console.log(`\t [${i + 1}/${leng}] run`)

        let _resources = resources.slice(i * LIMIT_FOR_PROGRESS, (i + 1) * LIMIT_FOR_PROGRESS)

        console.log(`\t importing data...`)
        let importedList = await createData({
          shop,
          accessToken,
          type,
          resources: _resources,
          productsWithOriginMetafields,
        })
        console.log(`\t total imported ${importedList.length}`)

        result[ii].result = result[ii].result.concat(importedList)

        console.log(`\t [${i + 1}/${leng}] completed`)

        let progress = ii / iileng + ((i + 1) / leng) * (1 / iileng)
        progress = Math.ceil(progress * 100)

        // update backgroundJob
        backgroundJob = await BackgroundJobMiddleware.update(backgroundJob.id, { progress })
      }

      console.log(`[${ii + 1}/${iileng}] completed`)
    }

    return result
  } catch (error) {
    console.log('importCommon error :>> ', error)
    throw error
  }
}

const create = async (job) => {
  try {
    // get backgroundJob
    let backgroundJob = await BackgroundJobMiddleware.findById(job.data.backgroundJobId)

    // check backgroundJob is running
    if (!['PENDING', 'RUNNING'].includes(backgroundJob.status)) {
      throw { status: backgroundJob.status, message: backgroundJob.message }
    }

    // update backgroundJob status PENDING -> RUNNING
    backgroundJob = await BackgroundJobMiddleware.update(job.data.backgroundJobId, {
      status: 'RUNNING',
    })
    const { code, duplicatorPackageId, versionId } = backgroundJob.data

    // get storeSetting
    let storeSetting = await StoreSettingMiddleware.findOne({ shop: job.data.shop })
    const { shop, accessToken } = storeSetting

    // get uniqueCode
    let uniqueCode = await UniqueCodeMiddleware.findOne({ code })

    // get duplicatorStore
    let duplicatorStore = await StoreSettingMiddleware.findOne({ shop: uniqueCode.shop })

    // get duplicatorPackage
    let duplicatorPackage = await DuplicatorPackageMiddleware.findById(duplicatorPackageId)
    let version = duplicatorPackage.versions.find((item) => item.id == versionId)

    /**
     * process
     */
    let progress = 0
    let message = ''
    let result = []

    let importType = version.resources.map((item) => item.type)
    importType = importType.includes('theme') ? 'theme' : importType.includes('file') ? 'file' : ''

    switch (importType) {
      case 'theme':
        result = await importTheme({
          shop,
          accessToken,
          backgroundJob,
          uniqueCode,
          duplicatorStore,
          duplicatorPackage,
          version,
        })
        break

      case 'file':
        result = await importFiles({
          shop,
          accessToken,
          backgroundJob,
          duplicatorPackage,
          version,
        })
        break

      default:
        // common
        result = await importCommon({
          shop,
          accessToken,
          backgroundJob,
          duplicatorStore,
          duplicatorPackage,
          version,
        })
        break
    }

    // update backgroundJob
    backgroundJob = await BackgroundJobMiddleware.update(job.data.backgroundJobId, {
      status: 'COMPLETED',
      progress: 100,
      message,
      result: result ? JSON.stringify(result) : null,
    })
  } catch (error) {
    // update backgroundJob
    let backgroundJob = await BackgroundJobMiddleware.update(job.data.backgroundJobId, {
      status: error.status || 'FAILED',
      message: error.message,
    })

    throw error
  }
}

const DuplicatorImportMiddleware = { create }

export default DuplicatorImportMiddleware
