import Controller from '../controllers/upload.js'
import MulterUpload from '../connector/multer/index.js'

export default function uploadRoute(app) {
  app.get('/upload/:filename', Controller.get)
  app.post('/upload', MulterUpload.array('file', 10), Controller.upload)
}
