import Controller from '../controllers/storefront.js'

export default function storefrontRoute(app) {
  app.get('/storefront-api/get', Controller.get)
}
