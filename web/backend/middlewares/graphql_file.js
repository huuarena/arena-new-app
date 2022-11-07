import apiCaller from '../helpers/apiCaller.js'
import graphqlCaller from '../helpers/graphqlCaller.js'

const FIELDS = `
  alt
  createdAt
  ... on GenericFile {
    id
    originalFileSize
    url
  }
  ... on MediaImage {
    id
    image {
      id
      originalSrc: url
      width
      height
    }
  }
  ... on Video {
    id
    duration
    preview {
      status
      image {
        id
        width
        height
        url
      }
    }
    originalSource {
      url
      width
      height
      format
      mimeType
    }
    sources {
      url
      width
      height
      format
      mimeType
    }
  }
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
        files (first: 100${pageInfo}) {
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

      items = items.concat(res.files.edges.map((item) => item.node))
      hasNextPage = res.files.pageInfo.hasNextPage
      pageInfo = res.files.pageInfo.endCursor

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

const find = async ({ shop, accessToken, first, reverse, pageInfo, search }) => {
  try {
    let _first = parseInt(first) >= 1 ? parseInt(first) : 20
    let _reverse = Boolean(reverse) ? `, reverse: true` : ``
    let _pageInfo = pageInfo ? `, after: "${pageInfo}"` : ``
    let _search = search ? `, query: "${search}"` : ``

    let query = `
    {
      files (first: ${_first}${_reverse}${_pageInfo}${_search}) {
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
    }
    `

    return await graphqlCaller({
      shop,
      accessToken,
      query,
    })
  } catch (error) {
    throw error
  }
}

const awaitFileReady = ({ shop, accessToken }) => {
  return new Promise((resolve, reject) => {
    let count = 0

    let _await = () => {
      count++

      if (count === 4) {
        throw new Error('File cannot be created')
      }

      setTimeout(() => {
        let query = `
        {
          files (first: 1, reverse: true) {
            edges {
              node {
                alt
                createdAt
                preview {
                  status
                }
              }
            }
          }
        }`

        graphqlCaller({ shop, accessToken, query })
          .then((res) => {
            if (res.files.edges[0]?.node?.preview?.status === 'READY') {
              find({ shop, accessToken, first: 1, reverse: true })
                .then((_res) => resolve(_res.files.edges[0].node))
                .catch((_err) => reject(_err))
            } else if (res.files.edges[0]?.node?.preview?.status === 'FAILED') {
              throw new Error('File extension does not match the format of the file')
            } else {
              _await()
            }
          })
          .catch((err) => reject(err))
      }, 2000)
    }
    _await()
  })
}

const create = async ({ shop, accessToken, variables }) => {
  try {
    let query = `
    mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          alt
          createdAt
        }
        userErrors {
          field
          message
        }
      }
    }`

    await graphqlCaller({
      shop,
      accessToken,
      query,
      variables,
    })

    return await awaitFileReady({ shop, accessToken })
  } catch (error) {
    throw error
  }
}

const update = async ({ shop, accessToken, variables }) => {
  try {
    let query = `
    mutation fileUpdate($input: [FileUpdateInput!]!) {
      fileUpdate(files: $input) {
        files {
          ${FIELDS}
        }
        userErrors {
          field
          message
        }
      }
    }`

    return await graphqlCaller({
      shop,
      accessToken,
      query,
      variables,
    })
  } catch (error) {
    throw error
  }
}

const _delete = async ({ shop, accessToken, variables }) => {
  try {
    let query = `
    mutation fileDelete($input: [ID!]!) {
      fileDelete(fileIds: $input) {
        deletedFileIds
        userErrors {
          field
          message
        }
      }
    }`

    return await graphqlCaller({
      shop,
      accessToken,
      query,
      variables,
    })
  } catch (error) {
    throw error
  }
}

const GraphqlFileMiddleware = {
  getAll,
  find,
  create,
  update,
  delete: _delete,
}

export default GraphqlFileMiddleware
