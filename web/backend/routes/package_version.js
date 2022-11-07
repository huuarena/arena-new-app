import Controller from '../controllers/package_version.js'

export default function packageVersionRoute(app) {
  app.get('/api/package-versions/count', Controller.count)
  app.get('/api/package-versions', Controller.find)
  app.get('/api/package-versions/:id', Controller.findById)
  app.put('/api/package-versions/:id', Controller.update)
  app.delete('/api/package-versions/:id', Controller.delete)
}
