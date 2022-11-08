import EnvatoApi from '../apis/envato.js'
import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import DuplicatorMiddleware from '../middlewares/duplicator.js'
import StoreSettingMiddleware from '../middlewares/store_setting.js'
import ThemeStoreMiddleware from '../middlewares/theme_store.js'
import UniqueCodeMiddleware from '../middlewares/unique_code.js'

export default {
  activeCode: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { code } = req.body

      // get unique code
      let uniqueCode = await UniqueCodeMiddleware.findOne({ code })
        .then((_res) => _res)
        .catch((_err) => null)

      if (!uniqueCode) {
        /**
         * Verify envato purchase code
         */
        let envatoData = await EnvatoApi.verifyCode({ code })
          .then((_res) => _res)
          .catch((_err) => null)

        if (!envatoData) {
          throw new Error('Invalid unique code')
        }

        let themeStore = await ThemeStoreMiddleware.findOne({ theme: envatoData.item.id })
          .then((_res) => _res)
          .catch((_err) => null)

        if (!themeStore) {
          throw new Error('Invalid unique code')
        }

        uniqueCode = await UniqueCodeMiddleware.findOne({
          shop: themeStore.shop,
          permission: 'ALL',
        })
          .then((_res) => _res)
          .catch((_err) => null)
      }

      if (!uniqueCode) {
        throw new Error('Invalid unique code')
      }

      // create duplicator
      let duplicator = await DuplicatorMiddleware.create({
        shop,
        originShop: uniqueCode.shop,
        code: uniqueCode.code,
      })

      return ResponseHandler.success(res, duplicator)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  getAll: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = await DuplicatorMiddleware.getAll({ shop })

      for (let i = 0; i < data.length; i++) {
        data[i].originShop = await StoreSettingMiddleware.findOne({ shop: data[i].originShop })
        data[i].code = await UniqueCodeMiddleware.findOne({ code: data[i].code })
      }

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  find: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let where = JSON.parse(req.query.where || '{}')
      where = { ...where, shop }

      let data = await DuplicatorMiddleware.find({ ...req.query, where })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  findById: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { id } = req.params

      let data = await DuplicatorMiddleware.findOne({ id })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  create: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = await DuplicatorMiddleware.create({ shop, ...req.body })

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

      let data = await DuplicatorMiddleware.findOne({ shop, id })

      data = await DuplicatorMiddleware.update(id, req.body)

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

      let data = await DuplicatorMiddleware.findOne({ shop, id })

      data = await DuplicatorMiddleware.delete(id)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
