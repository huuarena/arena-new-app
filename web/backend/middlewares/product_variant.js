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
        endpoint: `products/${product_id}/variants.json?limit=250&page_info=${nextPageInfo}`,
        pageInfo: true,
      })

      items = items.concat(res.variants)

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
      endpoint: `products/${product_id}/variants/count.json`,
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
      endpoint: `products/${product_id}/variants.json`,
      pageInfo: true,
    })
  } catch (error) {
    throw error
  }
}

const findById = async ({ shop, accessToken, id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `variants/${id}.json`,
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
      endpoint: `products/${product_id}/variants.json`,
      method: 'POST',
      data,
    })
  } catch (error) {
    throw error
  }
}

const update = async ({ shop, accessToken, id, data }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `variants/${id}.json`,
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
      endpoint: `products/${product_id}/variants/${id}.json`,
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

const ProductVariantMiddleware = {
  getAll,
  count,
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default ProductVariantMiddleware
