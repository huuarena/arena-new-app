import apiCaller from '../helpers/apiCaller.js'
import validateParams from '../helpers/validateParams.js'

const get = async ({ shop, accessToken }) => {
  try {
    validateParams({ shop, accessToken })

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `shop.json`,
    })
  } catch (error) {
    throw error
  }
}

const ShopifyShopifyShopMiddleware = {
  get,
}

export default ShopifyShopifyShopMiddleware
