import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import StoreSettingMiddleware from '../middlewares/store_setting.js'
import TicketMiddleware from '../middlewares/ticket.js'

export default {
  create: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { subject, description, email } = req.body

      let storeSetting = await StoreSettingMiddleware.findOne({ shop })

      let data = await TicketMiddleware.create({
        subject,
        description,
        shop,
        email,
        planName: storeSetting.planName,
        tag: 'support',
      })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
