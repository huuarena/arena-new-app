import Controller from '../controllers/duplicator.js'

export default function duplicatorRoute(app) {
  app.post('/api/duplicators-active-code', Controller.activeCode)
  app.get('/api/duplicators-all', Controller.getAll)
  app.get('/api/duplicators', Controller.find)
  app.get('/api/duplicators/:id', Controller.findById)
  app.post('/api/duplicators', Controller.create)
  app.put('/api/duplicators/:id', Controller.update)
  app.delete('/api/duplicators/:id', Controller.delete)
}
