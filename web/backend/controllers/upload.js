import ResponseHandler from '../helpers/responseHandler.js'
import fs from 'fs'
import mime from 'mime'
import GraphqlFileMiddleware from '../middlewares/graphql_file.js'

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */

export default {
  get: async (req, res) => {
    try {
      const { filename } = req.params

      let filepath = `${process.cwd()}/uploads/${filename}`

      let stat = await fs.statSync(filepath)

      res.set({ 'Content-Type': mime.getType(filepath) })
      res.set({ 'Content-Length': stat.size })

      res.status(200).sendFile(filepath)
    } catch (error) {
      res.status(400).send('Not found')
    }
  },

  upload: async (req, res) => {
    try {
      let files = req.files
      files = files.map((file) => ({
        ...file,
        path: `${process.cwd()}/${file.path}`,
      }))

      let filename = ''
      let filepath = ''
      let content = ''
      for (let i = 0, leng = files.length; i < leng; i++) {
        filename = files[i].originalname.replace(/\s+/g, '-')
        filepath = `${process.cwd()}/uploads/${filename}`
        content = await fs.readFileSync(files[i].path)

        await fs.writeFileSync(filepath, content)

        fs.unlink(files[i].path, () => {})

        files[i].url = `${process.env.HOST}/upload/${filename}`
      }

      files = files.map((file) => file.url)

      return ResponseHandler.success(res, files)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
