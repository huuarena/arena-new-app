import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import BackgroundJobMiddleware from '../middlewares/background_job.js'

export default {
  find: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let where = JSON.parse(req.query.where || '{}')
      where = { ...where, shop }

      let data = await BackgroundJobMiddleware.find({ ...req.query, where })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
