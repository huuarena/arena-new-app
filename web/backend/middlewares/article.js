import apiCaller from '../helpers/apiCaller.js'

const getAll = async ({ shop, accessToken, count, blog_id }) => {
  try {
    let items = []
    let res = null
    let hasNextPage = true
    let nextPageInfo = ''

    while (hasNextPage) {
      res = await apiCaller({
        shop,
        accessToken,
        endpoint: `blogs/${blog_id}/articles.json?limit=250&page_info=${nextPageInfo}`,
        pageInfo: true,
      })

      items = items.concat(res.articles)

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

const count = async ({ shop, accessToken, blog_id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `blogs/${blog_id}/articles/count.json`,
    })
  } catch (error) {
    throw error
  }
}

const find = async ({ shop, accessToken, blog_id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `blogs/${blog_id}/articles.json`,
      pageInfo: true,
    })
  } catch (error) {
    throw error
  }
}

const findById = async ({ shop, accessToken, id, blog_id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `blogs/${blog_id}/articles/${id}.json`,
    })
  } catch (error) {
    throw error
  }
}

const create = async ({ shop, accessToken, data, blog_id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `blogs/${blog_id}/articles.json`,
      method: 'POST',
      data,
    })
  } catch (error) {
    throw error
  }
}

const update = async ({ shop, accessToken, id, data, blog_id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `blogs/${blog_id}/articles/${id}.json`,
      method: 'PUT',
      data,
    })
  } catch (error) {
    throw error
  }
}

const _delete = async ({ shop, accessToken, id, blog_id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `blogs/${blog_id}/articles/${id}.json`,
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

const ArticleMiddleware = {
  getAll,
  count,
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default ArticleMiddleware
