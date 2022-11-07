import apiCaller from '../helpers/apiCaller.js'

const getAll = async ({ shop, accessToken, product_id, count }) => {
  try {
    let items = []
    let res = null
    let hasNextPage = true
    let nextPageInfo = ''

    while (hasNextPage) {
      res = await apiCaller({
        shop,
        accessToken,
        endpoint: `products/${product_id}/images.json?limit=250&page_info=${nextPageInfo}`,
        pageInfo: true,
      })

      items = items.concat(res.images)

      hasNextPage = res.pageInfo.hasNext
      nextPageInfo = res.pageInfo.nextPageInfo

      if (!isNaN(count) && parseInt(count) && items.length >= parseInt(count)) {
        hasNextPage = false
        nextPageInfo = ''

        items = items.slice(0, count)
      }
    }

    return items
  } catch (error) {
    throw error
  }
}

const count = async ({ shop, accessToken, product_id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images/count.json`,
    })
  } catch (error) {
    throw error
  }
}

const find = async ({ shop, accessToken, product_id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images.json`,
      pageInfo: true,
    })
  } catch (error) {
    throw error
  }
}

const findById = async ({ shop, accessToken, product_id, id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images/${id}.json`,
    })
  } catch (error) {
    throw error
  }
}

const create = async ({ shop, accessToken, product_id, data }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images.json`,
      method: 'POST',
      data,
    })
  } catch (error) {
    throw error
  }
}

const update = async ({ shop, accessToken, product_id, id, data }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images/${id}.json`,
      method: 'PUT',
      data,
    })
  } catch (error) {
    throw error
  }
}

const _delete = async ({ shop, accessToken, product_id, id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${product_id}/images/${id}.json`,
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

const ProductImageMiddleware = {
  getAll,
  count,
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default ProductImageMiddleware
