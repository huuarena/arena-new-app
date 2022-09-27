import apiCaller from '../helpers/apiCaller.js'
import graphqlCaller from '../helpers/graphqlCaller.js'
import validateParams from '../helpers/validateParams.js'

const FIELDS = `
  id
  title
  descriptionHtml
  vendor
  productType
  handle
  publishedAt
  templateSuffix
  status
  tags
  createdAt
  updatedAt
`

const getAll = async ({ shop, accessToken, count }) => {
  try {
    let items = []
    let res = null
    let query = ''
    let hasNextPage = true
    let pageInfo = ''

    while (hasNextPage) {
      pageInfo = pageInfo ? `, after: "${pageInfo}"` : ``

      query = `
      {
        products (first: 100${pageInfo}) {
          edges {
            node {
              ${FIELDS}
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }`

      res = await graphqlCaller({
        shop,
        accessToken,
        query,
      })

      items = items.concat(res.products.edges.map((item) => item.node))
      hasNextPage = res.products.pageInfo.hasNextPage
      pageInfo = res.products.pageInfo.endCursor

      if (!isNaN(count) && parseInt(count) && items.length >= parseInt(count)) {
        items = items.slice(0, count)
        hasNextPage = false
        pageInfo = ''
      }
    }

    return items
  } catch (error) {
    throw error
  }
}

const find = async ({ shop, accessToken, first, pageInfo }) => {
  try {
    validateParams({ shop, accessToken })

    let _first = parseInt(first) > 0 ? parseInt(first) : 20
    let _pageInfo = pageInfo ? `, after: "${pageInfo}"` : ``

    let query = `
    {
      products (first: ${_first}${_pageInfo}) {
        edges {
          node {
            ${FIELDS}
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }`

    return await graphqlCaller({
      shop,
      accessToken,
      query,
    })
  } catch (error) {
    throw error
  }
}

const findById = async ({ shop, accessToken, id }) => {
  try {
    validateParams({ shop, accessToken, id })

    let query = `
    {
      product (id: "${id}") {
        ${FIELDS}
      }
    }`

    return await graphqlCaller({
      shop,
      accessToken,
      query,
    })
  } catch (error) {
    throw error
  }
}

const create = async ({ shop, accessToken, variables }) => {
  try {
    validateParams({ shop, accessToken, variables })

    let query = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          ${FIELDS}
        }
        userErrors {
          field
          message
        }
      }
    }`

    let res = await graphqlCaller({
      shop,
      accessToken,
      query,
      variables,
    })

    return res[Object.keys(res)[0]]
  } catch (error) {
    throw error
  }
}

const update = async ({ shop, accessToken, variables }) => {
  try {
    validateParams({ shop, accessToken, variables })

    let query = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          ${FIELDS}
        }
        userErrors {
          field
          message
        }
      }
    }
    `

    let res = await graphqlCaller({
      shop,
      accessToken,
      query,
      variables,
    })

    return res[Object.keys(res)[0]]
  } catch (error) {
    throw error
  }
}

const _delete = async ({ shop, accessToken, variables }) => {
  try {
    validateParams({ shop, accessToken, variables })

    let query = `
    mutation productDelete($input: ProductDeleteInput!) {
      productDelete(input: $input) {
        deletedProductId
        userErrors {
          field
          message
        }
      }
    }
    `

    let res = await graphqlCaller({
      shop,
      accessToken,
      query,
      variables,
    })

    return res[Object.keys(res)[0]]
  } catch (error) {
    throw error
  }
}

const ProductGraphqlMiddleware = {
  getAll,
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default ProductGraphqlMiddleware
