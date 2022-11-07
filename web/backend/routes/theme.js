import Controller from '../controllers/theme.js'

export default function themeRoute(app) {
  app.get('/api/themes', Controller.find)
  app.get('/api/themes/:id', Controller.findById)
}
