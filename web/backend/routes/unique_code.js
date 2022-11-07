import Controller from '../controllers/unique_code.js'

export default function uniqueCodeRoute(app) {
  app.get('/api/unique-codes-all', Controller.getAll)
  app.post('/api/unique-codes', Controller.create)
  app.put('/api/unique-codes/:id', Controller.update)
  app.delete('/api/unique-codes/:id', Controller.delete)
}
