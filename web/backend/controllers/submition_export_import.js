import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import BullmqJobMiddleware from '../middlewares/bullmq_job.js'

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
      //   name: 'Test export customer',
      //   description: 'Test export customer',
      //   version: '1.0',
      //   resources: [
      //     {
      //       type: 'customer',
      //       count: '',
      //     },
      //   ],
      //   duplicatorPackageId: 53,
      // }

      // data = await BullmqJobMiddleware.create('duplicator_export', {
      //   ...req.body,
      //   shop,
      // })

      /**
       * Import
       */

      // req.body = {
      //   uuid: 'daa7a513-8856-4211-9027-8978bbe38520',
      //   duplicatorPackageId: 53,
      //   versionId: 1665217592971,
      // }

      // data = await BullmqJobMiddleware.create('duplicator_import', {
      //   ...req.body,
      //   shop,
      // })

      console.log('/api/submition data :>> ', data)
      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/submition error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
