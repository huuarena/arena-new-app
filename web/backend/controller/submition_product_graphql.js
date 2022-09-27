import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import ProductGraphqlMiddleware from '../middlewares/product_graphql.js'

export default {
  submit: async (req, res) => {
    console.log('\n----------------------------------------')
    console.log('/api/submition')
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = null

      let items = null
      let selected = null
      let created = null
      let updated = null
      let deleted = null
      let all = null

      items = await ProductGraphqlMiddleware.find({ shop, accessToken })
      selected = await ProductGraphqlMiddleware.findById({
        shop,
        accessToken,
        id: items.products.edges[0].node.id,
      })
      created = await ProductGraphqlMiddleware.create({
        shop,
        accessToken,
        variables: {
          input: {
            title: 'Sample product',
            descriptionHtml: '<p>Sample product</p>',
          },
        },
      })
      updated = await ProductGraphqlMiddleware.update({
        shop,
        accessToken,
        variables: {
          input: {
            id: created.product.id,
            title: 'Sample product - updated',
            descriptionHtml: '<p>Sample product</p>',
          },
        },
      })
      deleted = await ProductGraphqlMiddleware.delete({
        shop,
        accessToken,
        variables: {
          input: {
            id: created.product.id,
          },
        },
      })
      all = await ProductGraphqlMiddleware.getAll({ shop, accessToken })

      data = { items, selected, created, updated, deleted, all }

      console.log('/api/submition data :>> ', data)
      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/submition error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
