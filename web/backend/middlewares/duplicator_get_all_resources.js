import apiCaller from '../helpers/apiCaller.js'
import GraphqlFileMiddleware from './graphql_file.js'

export const getAll = async ({ shop, accessToken, type, resource }) => {
  try {
    let items = []
    let res = null
    let endpoint = ''
    let hasNextPage = true
    let nextPageInfo = ''

    while (hasNextPage) {
      endpoint = `${resource || ''}${type}s.json?limit=250&page_info=${nextPageInfo}`

      res = await apiCaller({
        shop,
        accessToken,
        endpoint,
        pageInfo: true,
      })

      items = items.concat(res[`${type}s`])

      hasNextPage = res.pageInfo.hasNext
      nextPageInfo = res.pageInfo.nextPageInfo
    }

    return items
  } catch (error) {
    console.log('getAll error :>> ', error)
    throw error
  }
}

export const getAllResources = async ({ shop, accessToken, type }) => {
  try {
    switch (type) {
      case 'file':
        return await GraphqlFileMiddleware.getAll({ shop, accessToken })

      default:
        return await getAll({ shop, accessToken, type })
    }
  } catch (error) {
    console.log('getAllResources error :>> ', error)
    throw error
  }
}
