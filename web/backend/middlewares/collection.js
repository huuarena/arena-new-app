import apiCaller from '../helpers/apiCaller.js'

const findById = async ({ shop, accessToken, id }) => {
  try {
    return await apiCaller({ shop, accessToken, endpoint: `collections/${id}.json` })
  } catch (error) {
    throw error
  }
}

const getProducts = async ({ shop, accessToken, id, limit, pageInfo, order }) => {
  try {
    let _limit = limit ? parseInt(limit) : 20

    let endpoint = `collections/${id}/products.json?limit=${_limit}`
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

const getAllProducts = async ({ shop, accessToken, id, count }) => {
  try {
    let items = []
    let res = null
    let hasNextPage = true
    let nextPageInfo = ''

    while (hasNextPage) {
      res = await apiCaller({
        shop,
        accessToken,
        endpoint: `collections/${id}/products.json?limit=250&page_info=${nextPageInfo}`,
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

const CollectionMiddleware = {
  findById,
  getProducts,
  getAllProducts,
}

export default CollectionMiddleware
