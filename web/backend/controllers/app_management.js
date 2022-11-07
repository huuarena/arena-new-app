import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import AppManagementService from '../services/app_management.js'

export default {
  getPrivacy: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = await AppManagementService.getPrivacy()

      data = data?.data?.[0] || {}

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.success(res, {})
    }
  },

  getFaqs: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = await AppManagementService.getFaqs()

      data = data?.data || []

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.success(res, [])
    }
  },
}
