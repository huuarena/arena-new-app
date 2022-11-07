import Controller from '../controllers/webhook.js'

export default function webhookRoute(app) {
  app.get('/api/webhooks', Controller.get)
  app.post('/api/webhooks', Controller.process)

  app.get('/api/webhooks/*', Controller.get)
  app.post('/api/webhooks/*', Controller.process)
}
