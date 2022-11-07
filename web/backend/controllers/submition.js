import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import AwsMiddleware from '../middlewares/aws.js'
import BullmqJobMiddleware from '../middlewares/bullmq_job.js'
import DuplicatorMiddleware from '../middlewares/duplicator.js'
import DuplicatorPackageMiddleware from '../middlewares/duplicator_package.js'
import ProductImageMiddleware from '../middlewares/product_image.js'
import StoreSettingMiddleware from '../middlewares/store_setting.js'
import ThemeStoreMiddleware from '../middlewares/theme_store.js'
import UniqueCodeMiddleware from '../middlewares/unique_code.js'

export default {
  submit: async (req, res) => {
    console.log('\n----------------------------------------')
    console.log('/api/submition')
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = {}

      /**
       * Export
       */

      // req.body = {
      //   name: 'Test export',
      //   description: 'Test export',
      //   version: '1.0',
      //   resources: [
      //     {
      //       type: 'product',
      //       count: '5',
      //     },
      //   ],
      //   duplicatorPackageId: 1,
      // }

      // data = await BullmqJobMiddleware.create('duplicator_export', {
      //   ...req.body,
      //   shop,
      // }

      /**
       * Import
       */

      // req.body = {
      //   code: '6f3a4090-a53e-475e-8388-2c289b8b4e23',
      //   duplicatorPackageId: 14,
      //   versionId: 1666427503757,
      //   resources: ['page'],
      // }

      // data = await BullmqJobMiddleware.create('duplicator_import', {
      //   ...req.body,
      //   shop,
      // })

      // let created = await StoreSettingMiddleware.create({ shop: 'nhkstore1412.myshopify.com' })
      // console.log('created :>> ', created)

      console.log('/api/submition data :>> ', data)
      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/submition error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
