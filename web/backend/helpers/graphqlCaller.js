import { Shopify } from '@shopify/shopify-api'
import validateParams from './validateParams.js'

/**
 * https://github.com/Shopify/shopify-api-node
 * https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/graphql.md
 */

const graphqlCaller = async ({ shop, accessToken, query, variables }) => {
  try {
    validateParams({ shop, accessToken, query })

    const client = new Shopify.Clients.Graphql(shop, accessToken)

    let data = query && variables ? { query, variables } : query

    let res = await client.query({ data }).then((res) => res.body)

    // check userErrors
    let userErrors = res.data[Object.keys(res.data)[0]]?.userErrors
    if (userErrors?.[0]?.message) {
      throw userErrors[0]
    }

    return res.data
  } catch (error) {
    console.log('graphqlCaller error :>> ', error)

    throw error.response?.errors?.[0]?.message ? error.response?.errors?.[0] : error
  }
}

export default graphqlCaller
