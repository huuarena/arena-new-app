import { Queue, Worker } from 'bullmq'
import DuplicatorExportMiddleware from './duplicator_export.js'
import DuplicatorImportMiddleware from './duplicator_import.js'
import DuplicatorPackageMiddleware from './duplicator_package.js'
import StoreSettingMiddleware from './store_setting.js'
import BackgroundJobMiddleware from './background_job.js'
import UniqueCodeMiddleware from './unique_code.js'
import DuplicatorMiddleware from './duplicator.js'

let MyQueues = []

/**
 *
 * @param {String} queueName
 * @returns Object
 */
const createNewQueue = (queueName) => {
  const myQueue = new Queue(queueName, {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  })

  const worker = new Worker(
    queueName,
    async (job) => {
      console.log(`${job.queue.name} ${job.data.__type} ${job.id} run`)

      try {
        switch (job.data.__type) {
          case 'duplicator_export':
            await DuplicatorExportMiddleware.create(job)
            break
          case 'duplicator_import':
            await DuplicatorImportMiddleware.create(job)
            break
          default:
            break
        }
      } catch (error) {
        console.log(`${job.queue.name} ${job.data.__type} ${job.id} throw error: ${error.message}`)
      }
    },
    { concurrency: 1 }
  )

  worker.on('completed', async (job) => {
    console.log(`${job.queue.name} ${job.data.__type} ${job.id} has completed`)

    // remove job
    job.remove()
  })

  worker.on('failed', async (job, err) => {
    console.log(`${job.queue.name} ${job.data.__type} ${job.id} has failed: ${err.message}`)

    // remove job
    job.remove()
  })

  worker.on('removed', async (job) => {
    // console.log(`${job.queue.name} ${job.data.__type} ${job.id} has removed`)
  })

  return myQueue
}

const create = async (__type, __data) => {
  try {
    let data = { ...__data }

    let duplicatorPackage = null
    let version = null

    switch (__type) {
      case 'duplicator_export':
        version = {
          id: Date.now(),
          name: data.name,
          description: data.description,
          version: data.version,
          resources: data.resources,
          status: 'PENDING',
          message: '',
          result: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // get storeSetting
        let storeSetting = await StoreSettingMiddleware.findOne({ shop: data.shop })
          .then((res) => res)
          .catch((err) => {
            throw new Error('Invalid session')
          })

        /**
         * Validate store plan for export
         * BASIC up to 500 items
         * PRO unlimited
         */
        let hasOverCount = false
        for (let i = 0; i < version.resources.length; i++) {
          if ('count' in version.resources[i]) {
            if (version.resources[i].count === 'all' || parseInt(version.resources[i].count) > 500) {
              hasOverCount = true
              break
            }
          }
        }
        if (hasOverCount && storeSetting.appPlan === 'BASIC') {
          throw new Error(
            'Your store plan is BASIC. You can only export up to 500 items per resource. Upgrade your store plan to export unlimited.'
          )
        }

        // create or update duplicatorPackage
        if (data.duplicatorPackageId) {
          duplicatorPackage = await DuplicatorPackageMiddleware.findOne({
            id: data.duplicatorPackageId,
            shop: data.shop,
          })
            .then((res) => res)
            .catch((res) => {
              throw new Error('Package not found')
            })

          // get version
          let _version = duplicatorPackage.versions.find((item) => item.version == data.version)
          if (_version) {
            version.id = _version.id

            duplicatorPackage.versions = duplicatorPackage.versions.map((item) =>
              item.id == version.id ? version : item
            )
          } else {
            duplicatorPackage.versions.unshift(version)
          }

          duplicatorPackage = await DuplicatorPackageMiddleware.update(data.duplicatorPackageId, {
            shop: data.shop,
            name: data.name,
            description: data.description,
            resources: data.resources,
            versions: duplicatorPackage.versions,
          })
        } else {
          duplicatorPackage = await DuplicatorPackageMiddleware.create({
            shop: data.shop,
            name: data.name,
            description: data.description,
            resources: data.resources,
            versions: [version],
          })
        }

        data = {
          ...data,
          duplicatorPackageId: duplicatorPackage.id,
          versionId: version.id,
        }
        break

      case 'duplicator_import':
        // get uniqueCode
        let uniqueCode = await UniqueCodeMiddleware.findOne({ code: data.code })
          .then((res) => res)
          .catch((err) => {
            throw new Error('Invalid unique code')
          })

        // get duplicatorStore
        let duplicatorStore = await StoreSettingMiddleware.findOne({ shop: uniqueCode.shop })
          .then((res) => res)
          .catch((err) => {
            throw new Error('Duplicator store not found')
          })

        // get duplicatorPackage
        duplicatorPackage = await DuplicatorPackageMiddleware.findOne(data.duplicatorPackageId)
          .then((res) => res)
          .catch((res) => {
            throw new Error('Package not found')
          })

        // get version
        version = duplicatorPackage.versions.find((item) => item.id == data.versionId)
        if (!version) {
          throw new Error('Package version not found')
        }
        if (!Boolean(version.status === 'COMPLETED' && version.result?.Location)) {
          throw new Error('Package version is not ready to use')
        }

        /**
         * Validate duplicator store plan for import
         * BASIC up to 500 items
         * PRO unlimited
         */
        let _hasOverCount = false
        for (let i = 0; i < version.resources.length; i++) {
          if ('count' in version.resources[i]) {
            if (version.resources[i].count === 'all' || parseInt(version.resources[i].count) > 500) {
              _hasOverCount = true
              break
            }
          }
        }
        if (_hasOverCount && duplicatorStore.appPlan === 'BASIC') {
          throw new Error(
            'Your duplicator store plan is BASIC. You can only import up to 500 items per resource. Upgrade your duplicatore store plan to import unlimited.'
          )
        }

        data = {
          ...data,
          duplicatorPackageId: duplicatorPackage.id,
          versionId: version.id,
          name: version.name,
          description: version.description,
          version: version.version,
        }
        break

      default:
        break
    }

    // create backgroundJob
    let backgroundJob = null
    if (data.backgroundJobId) {
      backgroundJob = await BackgroundJobMiddleware.findById(data.backgroundJobId)
      backgroundJob = await BackgroundJobMiddleware.update(data.backgroundJobId, {
        status: 'PENDING',
        message: '',
        progress: 0,
        result: null,
      })
    }
    if (!backgroundJob) {
      backgroundJob = await BackgroundJobMiddleware.create({
        queue: data.shop.replace(/.myshopify.com/g, '__queue'),
        shop: data.shop,
        type: __type,
        data: JSON.stringify(data),
      })
    }

    // --------------------------------------------
    /**
     * Add job to queue
     */
    let myQueue = null
    let queueName = data.shop.replace(/.myshopify.com/g, '__queue')
    for (let i = 0; i < MyQueues.length; i++) {
      if (MyQueues[i].name === queueName) {
        myQueue = MyQueues[i]
        break
      }
    }
    if (!myQueue) {
      myQueue = createNewQueue(queueName)
      MyQueues.push(myQueue)
    }

    let jobData = { __type, shop: data.shop, backgroundJobId: backgroundJob.id }

    let job = await myQueue.add(`${queueName}_${Date.now()}`, jobData)
    // --------------------------------------------

    return { id: backgroundJob.id }
  } catch (error) {
    console.log('BullmqJobMiddleware.create error :>> ', error.message)
    throw error
  }
}

const BullmqJobMiddleware = { create }

export default BullmqJobMiddleware
