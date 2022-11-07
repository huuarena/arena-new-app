import verifyToken from '../auth/verifyToken.js'
import ErrorCodes from '../constants/errorCodes.js'
import ResponseHandler from '../helpers/responseHandler.js'
import AwsMiddleware from '../middlewares/aws.js'
import BullmqJobMiddleware from '../middlewares/bullmq_job.js'
import DuplicatorPackageMiddleware from '../middlewares/duplicator_package.js'
import StoreSettingMiddleware from '../middlewares/store_setting.js'
import UniqueCodeMiddleware from '../middlewares/unique_code.js'

export default {
  export: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = await BullmqJobMiddleware.create('duplicator_export', {
        ...req.body,
        shop,
      })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  import: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = await BullmqJobMiddleware.create('duplicator_import', {
        ...req.body,
        shop,
      })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  checkCode: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { uuid } = req.body

      let duplicatorStore = await UniqueCodeMiddleware.verifyUniqueCode(uuid)
        .then((res) => res)
        .catch((err) => {
          throw new Error('Invalid unique code')
        })

      let storeSetting = await StoreSettingMiddleware.findOne({ shop })

      if (storeSetting.duplicators.map((item) => item.uuid).includes(uuid)) {
        throw new Error('Duplicator store has already been taken')
      }

      let duplicators = storeSetting.duplicators || []
      duplicators.push({
        uuid,
        permission: duplicatorStore.uniqueCodePermission,
        shop: duplicatorStore.shop,
        name: duplicatorStore.name,
      })
      duplicators = JSON.stringify(duplicators)

      storeSetting = await StoreSettingMiddleware.update(storeSetting.id, { duplicators })

      return ResponseHandler.success(res, storeSetting)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  getAll: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { code } = req.query

      let uniqueCode = await UniqueCodeMiddleware.findOne({ code })
        .then((_res) => _res)
        .catch((_err) => {
          throw new Error('Invalid unique code')
        })

      let data = await DuplicatorPackageMiddleware.getAll({ shop: uniqueCode.shop })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  find: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { code } = req.query

      let uniqueCode = await UniqueCodeMiddleware.findOne({ code })
        .then((_res) => _res)
        .catch((_err) => {
          throw new Error('Invalid unique code')
        })

      let where = JSON.parse(req.query.where || '{}')
      where = { ...where, shop: uniqueCode.shop }

      let data = await DuplicatorPackageMiddleware.find({ ...req.query, where })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  findById: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { code } = req.query
      const { id } = req.params

      let uniqueCode = await UniqueCodeMiddleware.findOne({ code })
        .then((_res) => _res)
        .catch((_err) => {
          throw new Error('Invalid unique code')
        })

      let data = await DuplicatorPackageMiddleware.findOne({ id, shop: uniqueCode.shop })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  update: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { id } = req.params

      let data = await DuplicatorPackageMiddleware.findOne({ id, shop })

      data = await DuplicatorPackageMiddleware.update(id, req.body)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  delete: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { id } = req.params

      let data = await DuplicatorPackageMiddleware.findOne({ id, shop })

      // delete files from s3
      data.versions?.forEach((item) =>
        item.result?.Key
          ? AwsMiddleware.deleteFile(item.result.Key)
              .then((_res) => console.log(`delete file ${item.result.Key} from s3 success`))
              .catch((_err) => console.log(`delete file ${item.result.Key} from s3 failed:`, _err.message))
          : null
      )

      DuplicatorPackageMiddleware.delete(data.id)
        .then((_res) => console.log(`duplicator package ${data.id} deleted`))
        .catch((_err) => console.log(`delete duplicator package ${data.id} failed:`, _err.message))

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
