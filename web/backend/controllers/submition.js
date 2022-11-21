import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import GraphqlFileMiddleware from '../middlewares/graphql_file.js'

export default {
  submit: async (req, res) => {
    console.log('\n----------------------------------------')
    console.log('/api/submition')
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      let data = {}

      let variables = {
        files: {
          alt: 'test upload file',
          // contentType: 'FILE',
          contentType: 'IMAGE',
          originalSource:
            'https:/arena-new-app.au.ngrok.io/upload/96A9E4A3-AC37-4843-BEF1-53417EC3F870.jpg',
          // originalSource:
          //   'https://bharatflux.com/wp-content/uploads/2020/04/IMG-20200404-WA0003.jpg',
        },
      }
      console.log('variables :>> ', variables)

      data = await GraphqlFileMiddleware.create({ shop, accessToken, variables })

      console.log('/api/submition data :>> ', data)
      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/submition error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
