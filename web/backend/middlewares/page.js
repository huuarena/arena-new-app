import apiCaller from '../helpers/apiCaller.js'

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
        endpoint: `pages.json?limit=250&page_info=${nextPageInfo}`,
        pageInfo: true,
      })

      items = items.concat(res.pages)

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
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `pages/count.json`,
    })
  } catch (error) {
    throw error
  }
}

const find = async ({ shop, accessToken }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `pages.json`,
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
      endpoint: `pages/${id}.json`,
    })
  } catch (error) {
    throw error
  }
}

const create = async ({ shop, accessToken, data }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `pages.json`,
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
      endpoint: `pages/${id}.json`,
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
      endpoint: `pages/${id}.json`,
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

const PageMiddleware = {
  getAll,
  count,
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default PageMiddleware
