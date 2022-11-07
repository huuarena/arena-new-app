import fs from 'fs'
import AdmZip from 'adm-zip'
import request from 'request'
import { ValidResources } from './duplicator_constants.js'
import json2csv from 'json2csv'
import CdnThemeMiddleware from './cdn_theme.js'
import ProductMiddleware from './product.js'
import MetafieldMiddleware from './metafield.js'

const createCSV = (rows) => {
  try {
    try {
      let fields = Object.keys(rows[0])
      let opts = { fields, withBOM: true }
      let csv = json2csv.parse(rows, opts)

      return csv
    } catch (error) {
      throw error
    }
  } catch (error) {
    throw error
  }
}

const uploadCDN = async ({ shop, accessToken, type, value }) => {
  try {
    let fileName = `duplicator_${type}_${Date.now()}.csv`
    let assetKey = `assets/${fileName}`
    let asset = { key: assetKey, value: value }

    return await CdnThemeMiddleware.upload({ shop, accessToken, asset })
  } catch (error) {
    throw error
  }
}

const handleFilename = (filename) => {
  try {
    let obj = {}
    let _filename = filename

    // extension
    obj.extension = _filename.split('.')[1]
    _filename = _filename.split('.')[0]

    // process
    obj.process = parseInt(_filename.substring(_filename.lastIndexOf('_') + 1, _filename.length))
    _filename = _filename.substring(0, _filename.lastIndexOf('_'))

    // type
    obj.type = _filename

    return obj
  } catch (error) {
    throw error
  }
}

const generatePackageName = (shop) => {
  try {
    let host = shop.replace(/.myshopify.com/g, '')
    let timestamp = new Date()
      .toISOString()
      .replace(/-/g, '')
      .replace(/\./g, '')
      .replace(/:/g, '')
      .replace(/T/g, '')
      .replace(/Z/g, '')

    return `backup_${host}_${timestamp}.zip`
  } catch (error) {
    throw error
  }
}

const handleImportFile = async (filepath) => {
  try {
    let zip = new AdmZip(filepath)

    let files = zip.getEntries()
    files = files.map((item) => {
      const file = item.toJSON()

      const { type } = handleFilename(file.name)
      const content = zip.readAsText(item)

      return { name: file.name, type, content }
    })

    // sort files
    let _files = []
    ValidResources.forEach((resourceType) =>
      files.forEach((file) => (file.type === resourceType ? _files.push(file) : null))
    )
    files = _files

    fs.unlink(filepath, (err) => {
      if (err) {
        console.log(`Delete import file failed: ${err.message}`)
      } else {
        // console.log(`Import file deleted`)
      }
    })

    return { files }
  } catch (error) {
    throw error
  }
}

const download = (url) => {
  try {
    return new Promise(function (resolve, reject) {
      request(
        {
          url: url,
          method: 'GET',
          encoding: null,
        },
        function (err, response, body) {
          if (err) reject(err)
          resolve(body)
        }
      )
    })
  } catch (error) {
    throw error
  }
}

const unzip = (buffer) => {
  try {
    return new Promise(function (resolve, reject) {
      let zip = new AdmZip(buffer)

      let files = zip.getEntries() // an array of ZipEntry records

      files = files.map((item) => {
        const file = item.toJSON()

        const { type } = handleFilename(file.name)
        const content = zip.readAsText(item)

        return { name: file.name, type, content }
      })

      // sort files
      let _files = []
      ValidResources.forEach((resourceType) =>
        files.forEach((file) => (file.type === resourceType ? _files.push(file) : null))
      )
      files = _files

      resolve({ files })
    })
  } catch (error) {
    throw error
  }
}

const downloadAndUnzipFile = async (url) => {
  try {
    let buffer = await download(url)

    let { files } = await unzip(buffer)

    return { files }
  } catch (error) {
    throw error
  }
}

const getProductsWithOriginMetafields = async ({ shop, accessToken }) => {
  try {
    let products = []

    console.log(`getting all products...`)
    products = await ProductMiddleware.getAll({ shop, accessToken })
    console.log(`total all products ${products.length}`)

    for (let i = 0, leng = products.length; i < leng; i++) {
      let metafields = await MetafieldMiddleware.getAll({
        shop,
        accessToken,
        resource: `products/${products[i].id}/`,
      })
      console.log(`\t [${i + 1}/${leng}] total metafields ${metafields.length}`)

      let originMetafield = metafields.find((item) => item.key === 'origin' && item.namespace === 'arena_duplicator')

      if (originMetafield) {
        let origin = JSON.parse(originMetafield.value)
        products[i] = { id: products[i].id, origin }
      } else {
        products[i] = null
      }
    }

    products = products.filter((item) => item)
    console.log(`total products have origin metafield ${products.length}`)

    return products
  } catch (error) {
    console.log('getProductsWithOriginMetafields error :>> ', error)
    throw error
  }
}

const DuplicatorActions = {
  createCSV,
  uploadCDN,
  handleFilename,
  generatePackageName,
  handleImportFile,
  download,
  downloadAndUnzipFile,
  getProductsWithOriginMetafields,
}

export default DuplicatorActions
