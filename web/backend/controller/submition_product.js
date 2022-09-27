import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import ProductMiddleware from '../middlewares/product.js'

export default {
  submit: async (req, res) => {
    console.log('\n----------------------------------------')
    console.log('/api/submition')
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = null

      let count = null
      let items = null
      let selected = null
      let created = null
      let updated = null
      let deleted = null
      let all = null

      count = await ProductMiddleware.count({ shop, accessToken })
      items = await ProductMiddleware.find({ shop, accessToken })
      selected = await ProductMiddleware.findById({ shop, accessToken, id: items.products[0].id })
      created = await ProductMiddleware.create({
        shop,
        accessToken,
        data: {
          product: {
            title: 'Sample product',
            body_html: '<p>Sample product</p>',
          },
        },
      })
      updated = await ProductMiddleware.update({
        shop,
        accessToken,
        id: created.product.id,
        data: {
          product: {
            title: 'Sample product - updated',
          },
        },
      })
      deleted = await ProductMiddleware.delete({ shop, accessToken, id: created.product.id })
      all = await ProductMiddleware.getAll({ shop, accessToken })

      data = { count, items, selected, created, updated, deleted, all }

      console.log('/api/submition data :>> ', data)
      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/submition error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
