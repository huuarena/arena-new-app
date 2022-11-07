import Controller from './../controllers/duplicator_package.js'

export default function duplicatorPackageRoute(app) {
  app.post('/api/duplicator-export', Controller.export)
  app.post('/api/duplicator-import', Controller.import)
  app.post('/api/duplicator-check-code', Controller.checkCode)
  app.get('/api/duplicator-packages-all', Controller.getAll)
  app.get('/api/duplicator-packages', Controller.find)
  app.get('/api/duplicator-packages/:id', Controller.findById)
  app.put('/api/duplicator-packages/:id', Controller.update)
  app.delete('/api/duplicator-packages/:id', Controller.delete)
}
