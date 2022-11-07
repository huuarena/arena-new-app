import Controller from '../controllers/webhook.js'

export default function webhookRoute(app) {
  app.post('/api/webhooks', Controller.process)
  app.get('/api/webhooks', Controller.get)
  app.put('/api/webhooks', Controller.get)
  app.delete('/api/webhooks', Controller.get)
  app.patch('/api/webhooks', Controller.get)
}
