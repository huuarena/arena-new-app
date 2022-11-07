import Controller from '../controllers/storefront.js'

export default function storefrontRoute(app) {
  app.get('/storefront-api/get', Controller.get)
  app.post('/storefront-api/export-navigation', Controller.exportNavigation)
  app.post('/storefront-api/import-navigation', Controller.importNavigation)
}
