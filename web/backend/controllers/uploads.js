import ResponseHandler from '../helpers/responseHandler.js'
import fs from 'fs'
import path from 'path'
import mime from 'mime'

/**
 * https://expressjs.com/en/api.html#res.sendFile
 */

export default {
  get: async (req, res) => {
    try {
      let data = {}

      const { name } = req.params
      console.log('name :>> ', name)

      let filepath = path.join(process.cwd(), 'uploads', name)
      console.log('filepath :>> ', filepath)

      let contentType = mime.getType(filepath)
      console.log('contentType :>> ', contentType)

      res.set({ 'Content-Type': 'image/jpeg' })
      res.status(200)
      res.sendFile(filepath)

      // return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  upload: async (req, res) => {
    console.log('\n----------------------------------------')
    console.log('/uploads')
    try {
      let data = {}

      console.log('req.files :>> ', req.files)

      let files = req.files
      files = files.map((file) => ({
        ...file,
        path: path.join(process.cwd(), file.path),
      }))

      for (let i = 0, leng = files.length; i < leng; i++) {
        let content = await fs.readFileSync(files[i].path)
        let filepath = path.join(process.cwd(), 'uploads', files[i].originalname)

        await fs.writeFileSync(filepath, content)

        files[i].url = path.join(process.env.HOST, 'uploads', files[i].originalname)
      }
      console.log('files :>> ', files)

      data = files

      console.log('/uploads data :>> ', data)
      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/uploads error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
