import Controller from './../controllers/billing.js'

export default function billingRoute(app) {
  app.get('/api/billings', Controller.getAppBilling)
  app.post('/api/billings', Controller.create)
}
