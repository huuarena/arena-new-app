import StoreSettingMiddleware from './store_setting.js'
import DuplicatorActions from './duplicator_actions.js'
import AdminZipMiddleware from './adm_zip.js'
import AwsMiddleware from './aws.js'
import DuplicatorPackageMiddleware from './duplicator_package.js'
import ThemeMiddleware from './theme.js'
import themeKit from '@shopify/themekit'
import fs from 'fs'
import path from 'path'
import GraphqlFileMiddleware from './graphql_file.js'
import getExportData from './duplicator_get_export_data.js'
import convertData from './duplicator_convert_data.js'
import BackgroundJobMiddleware from './background_job.js'
import { getAll, getAllResources } from './duplicator_get_all_resources.js'
import { checkHasMetafieldFilter, filterCondition } from './filter.js'
import themekit from '@shopify/themekit'

const LIMIT_PER_PROCESS = 100
const LIMIT_FOR_PROGRESS = 10

const exportTheme = async ({
  shop,
  accessToken,
  backgroundJob,
  duplicatorPackage,
  version,
  retried,
}) => {
  try {
    let result = { resources: version.resources.map((item) => ({ type: item.type })) }

    let cwd = './temp'
    let rootDir = `p_${duplicatorPackage.id}_${Date.now()}`
    let subDir = `v_${version.id}`

    let downloadDir = `${cwd}/${rootDir}/${subDir}`
    let zipFilepath = `${cwd}/${rootDir}/${subDir}.zip`

    const themeId = backgroundJob.data.resources[0].theme

    // get theme
    let theme = await ThemeMiddleware.findById({ shop, accessToken, id: themeId })
      .then((res) => res.theme)
      .catch((err) => {
        throw new Error('Theme not found')
      })
    console.log('theme :>> ', theme)

    result.resources[0].theme = theme

    // init config
    let config = `${theme.role === 'main' ? 'production:' : 'development:'}
      password: ${accessToken}
      theme_id: "${themeId}"
      store: ${shop}`
    console.log('theme kit config :>> ', config)

    // create directory
    if (!fs.existsSync(`${cwd}/${rootDir}`)) {
      await fs.mkdirSync(`${cwd}/${rootDir}`)
    }
    if (!fs.existsSync(`${cwd}/${rootDir}/${subDir}`)) {
      await fs.mkdirSync(`${cwd}/${rootDir}/${subDir}`)
    }

    // create config file
    await fs.writeFileSync(`${downloadDir}/config.yml`, config, 'utf8')

    // download theme
    await themekit.command(
      'download',
      {
        env: theme.role === 'main' ? 'production' : 'development',
        allowLive: theme.role === 'main' ? true : false,
      },
      {
        cwd: downloadDir,
      }
    )

    // create zip file
    await AdminZipMiddleware.create(zipFilepath)

    // read files
    let filepaths = []
    let files = await fs.readdirSync(downloadDir)
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      let filepath = `${downloadDir}/${file}`
      let isDirectory = fs.lstatSync(`${downloadDir}/${file}`).isDirectory()

      if (isDirectory) {
        let _files = await fs.readdirSync(`${downloadDir}/${file}`)
        for (let j = 0; j < _files.length; j++) {
          let _file = _files[j]
          let _filepath = `${downloadDir}/${file}/${_file}`
          let _isDirectory = fs.lstatSync(`${downloadDir}/${file}/${_file}`).isDirectory()

          if (_isDirectory) {
            let __files = await fs.readdirSync(`${downloadDir}/${file}/${_file}`)
            for (let k = 0; k < __files.length; k++) {
              let __file = __files[k]
              let __filepath = `${downloadDir}/${file}/${_file}/${__file}`

              filepaths.push(__filepath)
            }
          } else {
            filepaths.push(_filepath)
          }
        }
      } else {
        filepaths.push(filepath)
      }
    }

    // ignore config file
    filepaths = filepaths.filter((item) => !item.includes('config.yml'))
    console.log(`total theme files ${filepaths.length}`)

    result.resources[0].total = filepaths.length

    // add file to zip file
    for (let i = 0; i < filepaths.length; i++) {
      let filepath = filepaths[i]
      let filename = filepath.replace(`${downloadDir}/`, '')
      let content = await fs.readFileSync(filepath, 'utf8')

      await AdminZipMiddleware.update(zipFilepath, [{ filename, content }])
    }

    result.resources[0].exported = filepaths.length

    // upload to s3
    console.log(`uploading zip file to s3...`)
    let filename = `${rootDir}/${subDir}.zip`
    let uploaded = await AwsMiddleware.upload(filename, zipFilepath)
    console.log(`zip file uploaded ${uploaded.Location}`)

    result = { ...result, ...uploaded }

    return result
  } catch (error) {
    console.log('exportTheme error :>> ', error)

    if (retried === undefined) {
      return await exportTheme({
        shop,
        accessToken,
        backgroundJob,
        duplicatorPackage,
        version,
        retried: false,
      })
    } else {
      throw new Error(
        error.message || 'Has an error occurred while exporting theme. Please try again'
      )
    }
  }
}

const exportFiles = async ({ shop, accessToken, backgroundJob, duplicatorPackage, version }) => {
  try {
    let result = { resources: version.resources.map((item) => ({ type: item.type })) }

    let cwd = `./temp`
    let rootDir = `p_${duplicatorPackage.id}_${Date.now()}`
    let subDir = `v_${version.id}`

    const { type, count, filter, columns } = backgroundJob.data.resources[0]

    let files = await GraphqlFileMiddleware.getAll({ shop, accessToken })
    console.log(`total files ${files.length}`)

    result.resources[0].total = files.length

    // filter files without video
    files = files.filter((item) => !item.id.includes('Video'))
    console.log(`total files without video ${files.length}`)

    // handle files
    files = files
      .map((file) => {
        let contentType = file.id.includes('MediaImage')
          ? 'IMAGE'
          : file.id.includes('Video')
          ? 'VIDEO'
          : 'FILE'
        let originalSource = file.image?.originalSrc || file.originalSource?.url || file.url || ''

        let filename = originalSource
        filename = filename.split('/')[originalSource.split('/').length - 1]
        filename = filename.split('?')[0]

        return {
          id: file.id,
          alt: file.alt,
          contentType,
          originalSource,
          filename,
        }
      })
      .filter((item) => item.originalSource)
    console.log(`total valid files ${files.length}`)

    result.resources[0].filtered = files.length

    // slice files
    if (!isNaN(count) && parseInt(count) && files.length >= parseInt(count)) {
      files = files.slice(0, count)
      console.log(`total sliced files ${files.length}`)

      result.resources[0].sliced = files.length
    }

    result.resources[0].exported = files.length

    if (!files.length) {
      throw new Error('Have no files to export')
    }

    // create directory
    if (!fs.existsSync(`${cwd}/${rootDir}`)) {
      await fs.mkdirSync(`${cwd}/${rootDir}`)
    }
    if (!fs.existsSync(`${cwd}/${rootDir}/${subDir}`)) {
      await fs.mkdirSync(`${cwd}/${rootDir}/${subDir}`)
    }

    console.log(`download shopify source and upload to s3...`)
    for (let i = 0, leng = Math.ceil(files.length / LIMIT_FOR_PROGRESS); i < leng; i++) {
      for (let j = 0, jleng = LIMIT_FOR_PROGRESS; j < jleng; j++) {
        let index = i * LIMIT_FOR_PROGRESS + j

        if (index >= files.length) {
          break
        }

        // download
        let filepath = `${cwd}/${rootDir}/${subDir}/${files[index].filename}`
        let content = await DuplicatorActions.download(files[index].originalSource)
        await fs.writeFileSync(filepath, content)

        // upload to s3
        let filename = `${rootDir}/${subDir}/${files[index].filename}`
        let uploaded = await AwsMiddleware.upload(filename, filepath, false)

        files[index].newSource = uploaded.Location

        console.log(`\t [${index + 1}/${files.length}] success`)
      }

      let progress = Math.ceil(((i + 1) / leng) * 100)

      // update backgroundJob
      backgroundJob = await BackgroundJobMiddleware.update(backgroundJob.id, { progress })
    }

    // create csv file
    let filepath = `${cwd}/${rootDir}/${subDir}/files.csv`
    let content = DuplicatorActions.createCSV(files)
    await fs.writeFileSync(filepath, content)

    // upload to s3
    console.log(`uploading zip file to s3...`)
    let filename = `${rootDir}/${subDir}/files.csv`
    let uploaded = await AwsMiddleware.upload(filename, filepath)
    console.log(`zip file uploaded ${uploaded.Location}`)

    result = { ...result, ...uploaded }

    return result
  } catch (error) {
    console.log('exportFiles error :>> ', error)
    throw error
  }
}

const exportCommon = async ({ shop, accessToken, backgroundJob, duplicatorPackage, version }) => {
  try {
    let result = { resources: version.resources.map((item) => ({ type: item.type })) }

    let cwd = './temp'
    let rootDir = `p_${duplicatorPackage.id}_${Date.now()}`
    let subDir = `v_${version.id}`

    // create zip file
    let zipFilepath = `${cwd}/${rootDir}/${subDir}.zip`
    await AdminZipMiddleware.create(zipFilepath)
    console.log(`zip file created ${zipFilepath}`)

    for (let ii = 0, iileng = version.resources.length; ii < iileng; ii++) {
      console.log(`[${ii + 1}/${iileng}] run`)

      const { type, count, filter, columns } = version.resources[ii]

      // get all resources
      console.log(`getting all ${type}s...`)
      let resources = await getAllResources({ shop, accessToken, type })
      console.log(`total all ${type}s ${resources.length}`)

      result.resources[ii].total = resources.length

      // filter resources
      if (filter) {
        if (
          checkHasMetafieldFilter(filter) &&
          ['product', 'custom_collection', 'smart_collection', 'customer', 'page', 'blog'].includes(
            type
          )
        ) {
          console.log(`getting ${type}s metafields...`)
          for (let _i = 0, _leng = resources.length; _i < _leng; _i++) {
            resources[_i].metafields = await getAll({
              shop,
              accessToken,
              type: `metafield`,
              resource: `${type}s/${resources[_i].id}/`,
            })

            console.log(
              `\t [${_i + 1}/${_leng}]` +
                ` ${type} ${resources[_i].id}` +
                ` metafields ${resources[_i].metafields.length}`
            )
          }
        }

        resources = resources.filter((item) => filterCondition(item, filter))
        console.log(`filtered ${type}s ${resources.length}`)

        result.resources[ii].filtered = resources.length
      }

      // slice resources
      if (!isNaN(count) && parseInt(count) && resources.length >= parseInt(count)) {
        resources = resources.slice(0, count)
        console.log(`sliced ${type}s ${resources.length}`)

        result.resources[ii].sliced = resources.length
      }

      result.resources[ii].exported = resources.length

      // mapping resources to ids
      resources = resources.map((item) => item.id)

      for (let i = 0, leng = Math.ceil(resources.length / LIMIT_PER_PROCESS); i < leng; i++) {
        console.log(`\t [${i + 1}/${leng}] run`)

        let _resources = resources.slice(i * LIMIT_PER_PROCESS, (i + 1) * LIMIT_PER_PROCESS)

        let convertedData = []

        for (let j = 0, jleng = Math.ceil(_resources.length / LIMIT_FOR_PROGRESS); j < jleng; j++) {
          console.log(`\t\t [${j + 1}/${jleng}] run`)

          let __resources = _resources.slice(j * LIMIT_FOR_PROGRESS, (j + 1) * LIMIT_FOR_PROGRESS)

          // get export data
          console.log(`\t\t getting export data...`)
          let exportData = await getExportData({
            shop,
            accessToken,
            type,
            resources: __resources,
          })
          console.log(`\t\t total export data ${exportData.length}`)

          // convert data to row data
          let _convertedData = convertData(type, exportData)
          console.log(`\t\t total converted rows ${_convertedData.length}`)

          convertedData = convertedData.concat(_convertedData)

          console.log(`\t\t [${j + 1}/${jleng}] completed`)

          let progress =
            ii / iileng + (i / leng) * (1 / iileng) + ((j + 1) / jleng) * (1 / leng) * (1 / iileng)
          progress = Math.ceil(progress * 100)

          // update backgroundJob
          backgroundJob = await BackgroundJobMiddleware.update(backgroundJob.id, { progress })
        }

        // handle export columns
        if (columns?.length > 0) {
          convertedData = convertedData.map((item) => {
            let obj = {}
            columns.forEach((col) => (obj[col] = item[col]))
            return obj
          })
          console.log(`\t export columns handled`)
        }

        // create csv content
        let content = DuplicatorActions.createCSV(convertedData)
        console.log(`\t total characters ${content.length}`)

        // update zip file
        let no = i + 1
        no = no < 10 ? `00${no}` : no < 100 ? `0${no}` : no
        let filename = `${type}/${type}_${no}.csv`
        await AdminZipMiddleware.update(zipFilepath, [{ filename, content }])
        console.log(`\t zip file updated ${filename}`)

        console.log(`\t [${i + 1}/${leng}] completed`)
      }

      console.log(`[${ii + 1}/${iileng}] completed`)

      // update backgroundJob
      backgroundJob = await BackgroundJobMiddleware.update(backgroundJob.id, {
        result: JSON.stringify(result),
      })
    }

    // upload file to s3
    console.log(`uploading zip file to s3...`)
    let uploaded = await AwsMiddleware.upload(`${rootDir}/${subDir}.zip`, zipFilepath)
    console.log(`zip file uploaded ${uploaded.Location}`)

    result = { ...result, ...uploaded }

    return result
  } catch (error) {
    console.log('exportCommon error :>> ', error)
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
    const { duplicatorPackageId, versionId } = backgroundJob.data

    // get storeSetting
    let storeSetting = await StoreSettingMiddleware.findOne({ shop: job.data.shop })
    const { shop, accessToken } = storeSetting

    // get duplicatorPackage
    let duplicatorPackage = await DuplicatorPackageMiddleware.findById(duplicatorPackageId)
    let version = duplicatorPackage.versions.find((item) => item.id === versionId)

    // update vesion status
    version = {
      ...version,
      status: 'RUNNING',
      updatedAt: new Date().toISOString(),
    }
    duplicatorPackage = await DuplicatorPackageMiddleware.updateVersions(
      duplicatorPackageId,
      version
    )

    /**
     * process
     */
    let progress = 0
    let message = ''
    let result = null

    let exportType = backgroundJob.data.resources.map((item) => item.type)
    exportType = exportType.includes('theme') ? 'theme' : exportType.includes('file') ? 'file' : ''

    switch (exportType) {
      case 'theme':
        result = await exportTheme({ shop, accessToken, backgroundJob, duplicatorPackage, version })
        break

      case 'file':
        result = await exportFiles({ shop, accessToken, backgroundJob, duplicatorPackage, version })
        break

      default:
        result = await exportCommon({
          shop,
          accessToken,
          backgroundJob,
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

    // update version
    version = {
      ...version,
      status: 'COMPLETED',
      message,
      result,
      updatedAt: new Date().toISOString(),
    }
    duplicatorPackage = await DuplicatorPackageMiddleware.updateVersions(
      duplicatorPackageId,
      version
    )
    console.log('version :>> ', version)
    console.log('result :>> ', version.result)
  } catch (error) {
    // update backgroundJob
    const backgroundJob = await BackgroundJobMiddleware.update(job.data.backgroundJobId, {
      status: error.status || 'FAILED',
      message: error.message,
    })
    const { duplicatorPackageId, versionId } = backgroundJob.data

    // update version
    let duplicatorPackage = await DuplicatorPackageMiddleware.findById(duplicatorPackageId)
    let version = duplicatorPackage.versions.find((item) => item.id === versionId)
    version = {
      ...version,
      status: error.status || 'FAILED',
      message: error.message,
      updatedAt: new Date().toISOString(),
    }
    duplicatorPackage = await DuplicatorPackageMiddleware.updateVersions(
      duplicatorPackageId,
      version
    )

    throw error
  }
}

const DuplicatorExportMiddleware = { create }

export default DuplicatorExportMiddleware
