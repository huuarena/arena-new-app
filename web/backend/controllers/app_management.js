import ResponseHandler from '../helpers/responseHandler.js'
import AppManagementService from '../middlewares/app_management.js'

export default {
  getPrivacy: async (req, res) => {
    try {
      let data = await AppManagementService.getPrivacy()

      data = data.data[0]

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.success(res, null)
    }
  },

  getFaqs: async (req, res) => {
    try {
      let data = await AppManagementService.getFaqs()

      data = data.data

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.success(res, null)
    }
  },
}
