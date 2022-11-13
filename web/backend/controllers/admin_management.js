import ErrorCodes from '../constants/errorCodes.js'
import ResponseHandler from '../helpers/responseHandler.js'
import StoreSettingMiddleware from '../middlewares/store_setting.js'

const VERIFY_IPS = [
  '171.252.155.38', // arena.local
]

const VERIFY_TOKENS = [
  '534dbf677b41cbe85dbd1481ace55cce065dca2426785181c', // astrapi app
]

const verifyRequest = (req) => {
  try {
    const ip = req.headers['x-forwarded-for']
    const token = req.headers['authorization']

    if (!VERIFY_IPS.includes(ip)) {
      throw new Error(ErrorCodes.ACCESS_DENIED)
    }
    if (!VERIFY_TOKENS.includes(token.replace(/Bearer /g, ''))) {
      throw new Error(ErrorCodes.ACCESS_DENIED)
    }
  } catch (error) {
    throw new Error(ErrorCodes.ACCESS_DENIED)
  }
}

export default {
  getStoreSettings: async (req, res) => {
    try {
      verifyRequest(req)

      let filter = JSON.parse(req.query.filter || '{}')

      let data = await StoreSettingMiddleware.find(filter)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  updateStoreSetting: async (req, res) => {
    try {
      verifyRequest(req)

      const { id } = req.params
      const { status, acceptedAt, appPlan, testStore, role, credits } = req.body

      let data = await StoreSettingMiddleware.update(id, {
        status,
        acceptedAt,
        appPlan,
        testStore,
        role,
        credits,
      })

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
