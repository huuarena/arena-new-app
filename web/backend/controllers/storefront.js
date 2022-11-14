import ResponseHandler from '../helpers/responseHandler.js'
import validateParams from '../helpers/validateParams.js'

export default {
  get: async (req, res) => {
    try {
      return ResponseHandler.success(res, {})
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
