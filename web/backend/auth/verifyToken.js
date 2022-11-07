import { Shopify } from '@shopify/shopify-api'
import ErrorCodes from '../constants/errorCodes.js'

export default async function verifyToken(req, res) {
  try {
    if (!req.headers.authorization) {
      throw new Error(ErrorCodes.UNAUTHORIZED)
    }

    let shop = null

    let bearerPresent = req.headers.authorization?.match(/Bearer (.*)/)
    if (bearerPresent) {
      const payload = Shopify.Utils.decodeSessionToken(bearerPresent[1])
      shop = payload.dest.replace('https://', '')
    }

    if (!shop) {
      throw new Error(ErrorCodes.UNAUTHORIZED)
    }

    const session = await Shopify.Utils.loadCurrentSession(req, res, false)

    if (!session || session?.shop !== shop) {
      throw new Error(ErrorCodes.UNAUTHORIZED)
    }

    return session
  } catch (error) {
    return res.status(403).send(error.message)
  }
}
