import AWS from 'aws-sdk'
import fs from 'fs'
import path from 'path'

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY_ID, AWS_BUCKET_NAME } = process.env

// Set the AWS Region.
const REGION = 'us-east-1' //e.g. "us-east-1"

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY_ID,
  region: REGION,
})

/**
 * Common MIME types
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
const CommonMineTypes = {
  '.aac': 'audio/aac',
  '.abw': 'application/x-abiword',
  '.arc': 'application/x-freearc',
  '.avif': 'image/avif',
  '.avi': 'video/x-msvideo',
  '.azw': 'application/vnd.amazon.ebook',
  '.bin': 'application/octet-stream',
  '.bmp': 'image/bmp',
  '.bz': 'application/x-bzip',
  '.bz2': 'application/x-bzip2',
  '.cda': 'application/x-cdf',
  '.csh': 'application/x-csh',
  '.css': 'text/css',
  '.csv': 'text/csv',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.eot': 'application/vnd.ms-fontobject',
  '.epub': 'application/epub+zip',
  '.gz': 'application/gzip',
  '.gif': 'image/gif',
  '.htm': 'text/html',
  '.html': 'text/html',
  '.ico': 'image/vnd.microsoft.icon',
  '.ics': 'text/calendar',
  '.jar': 'application/java-archive',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.jsonld': 'application/ld+json',
  '.mid': 'audio/midi',
  '.midi': 'audio/midi',
  '.mjs': 'text/javascript',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.mpeg': 'video/mpeg',
  '.mpkg': 'application/vnd.apple.installer+xml',
  '.odp': 'application/vnd.oasis.opendocument.presentation',
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.oga': 'audio/ogg',
  '.ogv': 'video/ogg',
  '.ogx': 'application/ogg',
  '.opus': 'audio/opus',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.php': 'application/x-httpd-php',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.rar': 'application/vnd.rar',
  '.rtf': 'application/rtf',
  '.sh': 'application/x-sh',
  '.svg': 'image/svg+xml',
  '.tar': 'application/x-tar',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.ts': 'video/mp2t',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.vsd': 'application/vnd.visio',
  '.wav': 'audio/wav',
  '.weba': 'audio/webm',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xhtml': 'application/xhtml+xml',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xml': 'application/xml',
  '.xul': 'application/vnd.mozilla.xul+xml',
  '.zip': 'application/zip',
  '.3gp': 'video/3gpp',
  '.3g2': 'video/3gpp2',
  '.7z': 'application/x-7z-compressed',
}

/**
 *
 * @param {String} name
 * @returns Object
 */
const createBucket = async (name) => {
  try {
    return new Promise((resolve, reject) => {
      const params = { Bucket: name }

      s3.createBucket(params, function (err, data) {
        if (err) reject(err)

        resolve(data)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @returns Array<Object>
 */
const listBuckets = async () => {
  try {
    return new Promise((resolve, reject) => {
      s3.listBuckets(function (err, data) {
        if (err) reject(err)

        resolve(data.Buckets)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @returns Object
 */
const getPrimaryBucket = async () => {
  try {
    return new Promise((resolve, reject) => {
      s3.listBuckets(function (err, data) {
        if (err) reject(err)

        const bucket = data.Buckets.find((item) => item.Name === AWS_BUCKET_NAME)

        if (!bucket) {
          reject(new Error('Not found'))
        }

        resolve(bucket)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {String} name
 * @returns Object
 */
const deleteBucket = async (name) => {
  try {
    return new Promise((resolve, reject) => {
      const params = { Bucket: name }

      s3.deleteBucket(params, function (err, data) {
        if (err) reject(err)

        resolve(data)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {String} keyword
 * @returns Array<Object>
 */
const getFiles = async (keyword) => {
  try {
    return new Promise((resolve, reject) => {
      const params = { Bucket: AWS_BUCKET_NAME }

      s3.listObjects(params, function (err, data) {
        if (err) reject(err)

        resolve(keyword ? data.Contents.filter((item) => item.Key.includes(keyword)) : data.Contents)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {String} key
 * @returns Object
 */
const getFileByKey = async (key) => {
  try {
    return new Promise((resolve, reject) => {
      const params = { Bucket: AWS_BUCKET_NAME }

      s3.listObjects(params, function (err, data) {
        if (err) reject(err)

        let file = data.Contents.find((item) => item.Key === key)

        if (!file) {
          reject(new Error('Not found'))
        }

        resolve(file)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {String} key
 * @param {String} body
 * @returns Object
 */
const uploadFile = async (key, body) => {
  try {
    return new Promise(async (resolve, reject) => {
      const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Body: body,
        ACL: 'public-read',
      }

      s3.upload(params, function (err, data) {
        if (err) reject(err)

        resolve(data)
      })
    })
  } catch (error) {
    throw error
  }
}

/**
 *
 * @param {String} Key
 * @returns Object
 */
const deleteFile = async (Key) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key,
    }

    s3.deleteObject(params, function (err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}

/**
 *
 * @param {String} key
 * @param {String} filepath
 * @param {Boolean} unlinked
 * @returns Object
 */
const upload = async (key, filepath, unlinked = true) => {
  try {
    return new Promise(async (resolve, reject) => {
      let body = fs.createReadStream(filepath)

      let ext = path.extname(filepath)
      let mimeType = CommonMineTypes[ext]

      let params = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Body: body,
        ACL: 'public-read',
      }
      if (mimeType) {
        params.ContentType = mimeType
      }

      s3.upload(params, function (err, data) {
        if (err) reject(err)

        if (unlinked) {
          /**
           * Delete file
           */
          fs.unlink(filepath, () => {})
        }

        const { Location, Key } = data

        resolve({ Location, Key })
      })
    })
  } catch (error) {
    throw error
  }
}

const AwsMiddleware = {
  // createBucket,
  // listBuckets,
  // getPrimaryBucket,
  // deleteBucket,
  getFiles,
  getFileByKey,
  uploadFile,
  deleteFile,
  upload,
}

export default AwsMiddleware
