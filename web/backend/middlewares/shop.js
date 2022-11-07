import apiCaller from '../helpers/apiCaller.js'

const get = async ({ shop, accessToken }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `shop.json`,
    })
  } catch (error) {
    throw error
  }
}

const ShopMiddleware = {
  get,
}

export default ShopMiddleware
