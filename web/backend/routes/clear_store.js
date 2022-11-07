import Controller from '../controllers/clear_store.js'

export default function clearStoreRoute(app) {
  app.post('/api/clear-store', Controller.clear)
}
