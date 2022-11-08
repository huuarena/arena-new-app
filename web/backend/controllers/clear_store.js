import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import BlogMiddleware from '../middlewares/blog.js'
import CustomerMiddleware from '../middlewares/customer.js'
import CustomCollectionMiddleware from '../middlewares/custom_collection.js'
import GraphqlFileMiddleware from '../middlewares/graphql_file.js'
import MetafieldMiddleware from '../middlewares/metafield.js'
import PageMiddleware from '../middlewares/page.js'
import ProductMiddleware from '../middlewares/product.js'
import RedirectMiddleware from '../middlewares/redirect.js'
import SmartCollectionMiddleware from '../middlewares/smart_collection.js'

const clearData = async ({ shop, accessToken, resources }) => {
  try {
    let Middleware = null
    let items = []

    for (let i = 0, leng = resources.length; i < leng; i++) {
      switch (resources[i]) {
        case 'product':
          Middleware = ProductMiddleware
          break

        case 'custom_collection':
          Middleware = CustomCollectionMiddleware
          break

        case 'smart_collection':
          Middleware = SmartCollectionMiddleware
          break

        case 'customer':
          Middleware = CustomerMiddleware
          break

        case 'page':
          Middleware = PageMiddleware
          break

        case 'blog':
          Middleware = BlogMiddleware
          break

        case 'redirect':
          Middleware = RedirectMiddleware
          break

        case 'metafield':
          Middleware = MetafieldMiddleware
          break

        case 'file':
          Middleware = GraphqlFileMiddleware
          break

        default:
          break
      }

      items = await Middleware.getAll({ shop, accessToken })

      console.log(`total ${resources[i]}s ${items.length}`)

      for (let j = 0, jleng = items.length; j < jleng; j++) {
        switch (resources[i]) {
          case 'file':
            await Middleware.delete({
              shop,
              accessToken,
              variables: {
                input: [items[j].id],
              },
            })
              .then((_res) =>
                console.log(`\t [${j + 1}/${jleng}] ${resources[i]} ${items[j].id} deleted`)
              )
              .catch((_err) =>
                console.log(
                  `\t [${j + 1}/${jleng}] delete ${resources[i]} ${items[j].id} failed: ${
                    _err.message
                  }`
                )
              )
            break

          default:
            await Middleware.delete({ shop, accessToken, id: items[j].id })
              .then((_res) =>
                console.log(`\t [${j + 1}/${jleng}] ${resources[i]} ${items[j].id} deleted`)
              )
              .catch((_err) =>
                console.log(
                  `\t [${j + 1}/${jleng}] delete ${resources[i]} ${items[j].id} failed: ${
                    _err.message
                  }`
                )
              )
            break
        }
      }
    }

    console.log('All data cleared!')
  } catch (error) {
    console.log(error.message)
  }
}

export default {
  clear: async (req, res) => {
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      const { resources } = req.body

      clearData({ shop, accessToken, resources })

      return ResponseHandler.success(res, {})
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
