import Controller from '../controllers/uploads.js'
import MulterUpload from '../connector/multer/index.js'

export default function uploadsRoute(app) {
  app.get('/uploads/:name', Controller.get)
  app.post('/uploads', MulterUpload.array('file', 10), Controller.upload)
}
