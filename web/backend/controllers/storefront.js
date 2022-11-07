import ResponseHandler from '../helpers/responseHandler.js'
import validateParams from '../helpers/validateParams.js'
import AwsMiddleware from '../middlewares/aws.js'
import DuplicatorActions from '../middlewares/duplicator_actions.js'
import DuplicatorPackageMiddleware from '../middlewares/duplicator_package.js'
import StoreSettingMiddleware from '../middlewares/store_setting.js'

export default {
  get: async (req, res) => {
    try {
      return ResponseHandler.success(res, {})
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  exportNavigation: async (req, res) => {
    try {
      const { shop, menus } = req.body

      validateParams({ shop, menus })

      let storeSetting = await StoreSettingMiddleware.findOne({ shop })
        .then((item) => item)
        .catch((err) => {
          throw new Error('App does not installed on your store. Please install app first.')
        })

      let duplicatorPackage = await DuplicatorPackageMiddleware.getAll({ shop })
        .then((items) => {
          for (let i = 0, leng = items.length; i < leng; i++) {
            for (let j = 0, jleng = items[i].versions.length; j < jleng; j++) {
              if (items[i].versions[j].resources.find((item) => item.type === 'navigation')) {
                return items[i]
              }
            }
          }

          return undefined
        })
        .catch((err) => {
          return undefined
        })

      if (!duplicatorPackage) {
        let versions = [
          {
            id: Date.now(),
            name: 'NAVIGATION',
            version: '1.0',
            resources: [{ type: 'navigation' }],
            status: 'PENDING',
            message: '',
            result: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]

        // create new duplicatorPackage
        duplicatorPackage = await DuplicatorPackageMiddleware.create({
          shop,
          name: 'NAVIGATION',
          versions,
        })
      }

      let version = duplicatorPackage.versions[0]

      let rootDir = `p_${duplicatorPackage.id}`
      let subDir = `v_${version.id}`
      let content = typeof menus === 'string' ? menus : JSON.stringify(menus)
      let uploaded = await AwsMiddleware.uploadFile(`${rootDir}/${subDir}.json`, content)
      const { Key, Location } = uploaded

      // update version
      version = {
        ...version,
        status: 'COMPLETED',
        result: { Key, Location },
        updatedAt: new Date().toISOString(),
      }
      duplicatorPackage = await DuplicatorPackageMiddleware.updateVersions(duplicatorPackage.id, version)

      return ResponseHandler.success(res, { url: Location })
    } catch (error) {
      console.log('exportNavigation error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },

  importNavigation: async (req, res) => {
    try {
      const { shop } = req.body

      validateParams({ shop })

      let storeSetting = await StoreSettingMiddleware.findOne({ shop })
        .then((item) => item)
        .catch((err) => {
          throw new Error('Invalid shop session')
        })

      let duplicatorPackage = await DuplicatorPackageMiddleware.getAll({ shop })
        .then((items) => {
          for (let i = 0, leng = items.length; i < leng; i++) {
            for (let j = 0, jleng = items[i].versions.length; j < jleng; j++) {
              if (items[i].versions[j].resources.find((item) => item.type === 'navigation')) {
                return items[i]
              }
            }
          }

          return undefined
        })
        .catch((err) => {
          return undefined
        })

      if (!duplicatorPackage) {
        throw new Error('Navigation package not found or not exported yet. Please export navigation first.')
      }

      let version = duplicatorPackage.versions[0]

      if (!version || version.status !== 'COMPLETED' || !version.result.Location) {
        throw new Error('Package version is not ready to use.')
      }

      let buffer = await DuplicatorActions.download(version.result.Location)

      let data = JSON.parse(buffer.toString())

      return ResponseHandler.success(res, { menus: data })
    } catch (error) {
      console.log('importNavigation error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
