import Controller from '../controllers/webhook.js'

export default function webhookRoute(app) {
  app.get(['/api/webhooks', '/api/webhooks/*'], Controller.get)
  app.post(['/api/webhooks', '/api/webhooks/*'], Controller.process)
}
