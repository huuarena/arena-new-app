import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import DuplicatorActions from '../middlewares/duplicator_actions.js'
import DuplicatorPackageMiddleware from '../middlewares/duplicator_package.js'
import UniqueCodeMiddleware from '../middlewares/unique_code.js'
import csvtojson from 'csvtojson'

export default {
  submit: async (req, res) => {
    console.log('\n----------------------------------------')
    console.log('/api/submition')
    try {
      const session = await verifyToken(req, res)
      const { shop, accessToken } = session

      req.body = {
        duplicatorPackageId: 70,
        versionId: 1665646676480,
        uuid: '23f20438-02f2-4887-9741-d9b957a13e50',
      }

      let data = {}

      let duplicatorStore = await UniqueCodeMiddleware.verifyUniqueCode(req.body.uuid)
      console.log('duplicatorStore :>> ', duplicatorStore)

      let duplicatorPackage = await DuplicatorPackageMiddleware.findById(
        req.body.duplicatorPackageId
      )
      console.log('duplicatorPackage :>> ', duplicatorPackage)

      let version = duplicatorPackage.versions.find((item) => item.id == req.body.versionId)
      console.log('version :>> ', version)

      let { files } = await DuplicatorActions.downloadAndUnzipFile(version.result.Location)

      for (let i = 0; i < files.length; i++) {
        files[i].data = await csvtojson().fromString(files[i].content)

        delete files[i].content
      }
      console.log('files :>> ', files)

      data = files

      console.log('/api/submition data :>> ', data)
      return ResponseHandler.success(res, data)
    } catch (error) {
      console.log('/api/submition error :>> ', error.message)
      return ResponseHandler.error(res, error)
    }
  },
}
