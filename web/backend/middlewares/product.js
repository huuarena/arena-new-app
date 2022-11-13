import apiCaller from '../helpers/apiCaller.js'
import graphqlCaller from '../helpers/graphqlCaller.js'

const getProductTypes = async ({ shop, accessToken }) => {
  try {
    let query = `
    query productTypes {
      shop {
        productTypes(first: 250) {
          edges {
            node
          }
        }
      }
    }
    `

    let res = await graphqlCaller({
      shop,
      accessToken,
      query,
    })

    return res.shop['productTypes'].edges.map((item) => item.node)
  } catch (error) {
    throw error
  }
}

const getProductVendors = async ({ shop, accessToken }) => {
  try {
    let query = `
    query productVendors {
      shop {
        productVendors(first: 250) {
          edges {
            node
          }
          pageInfo {
            hasNextPage
            hasNextPage
            startCursor
            endCursor
          }
        }
      }
    }
    `

    let res = await graphqlCaller({
      shop,
      accessToken,
      query,
    })

    return res.shop['productVendors'].edges.map((item) => item.node)
  } catch (error) {
    throw error
  }
}

const getAll = async ({ shop, accessToken, count }) => {
  try {
    let items = []
    let res = null
    let hasNextPage = true
    let nextPageInfo = ''

    while (hasNextPage) {
      res = await apiCaller({
        shop,
        accessToken,
        endpoint: `products.json?limit=250&page_info=${nextPageInfo}`,
        pageInfo: true,
      })

      items = items.concat(res.products)

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

const count = async ({ shop, accessToken }) => {
  try {
    return await apiCaller({ shop, accessToken, endpoint: `products/count.json` })
  } catch (error) {
    throw error
  }
}

const find = async ({ shop, accessToken, limit, pageInfo, order }) => {
  try {
    let _limit = limit ? parseInt(limit) : 20

    let endpoint = `products.json?limit=${_limit}`
    if (pageInfo) {
      endpoint += `&page_info=${pageInfo}`
    } else {
      if (order) {
        endpoint += `&order=${order}`
      } else {
        endpoint += `&order=updated_at+desc`
      }
    }

    return await apiCaller({
      shop,
      accessToken,
      endpoint,
      pageInfo: true,
    })
  } catch (error) {
    throw error
  }
}

const findById = async ({ shop, accessToken, id }) => {
  try {
    return await apiCaller({ shop, accessToken, endpoint: `products/${id}.json` })
  } catch (error) {
    throw error
  }
}

const create = async ({ shop, accessToken, data }) => {
  try {
    return await apiCaller({ shop, accessToken, endpoint: `products.json`, method: 'POST', data })
  } catch (error) {
    throw error
  }
}

const update = async ({ shop, accessToken, id, data }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${id}.json`,
      method: 'PUT',
      data,
    })
  } catch (error) {
    throw error
  }
}

const _delete = async ({ shop, accessToken, id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `products/${id}.json`,
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

const ProductMiddleware = {
  getProductTypes,
  getProductVendors,
  getAll,
  count,
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default ProductMiddleware
