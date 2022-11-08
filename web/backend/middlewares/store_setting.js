import Repository from '../repositories/store_setting.js'

const Status = {
  RUNNING: 'RUNNING',
  UNINSTALLED: 'UNINSTALLED',
  LOCKED: 'LOCKED',
}
const AppPlan = {
  BASIC: 'BASIC',
  PRO: 'PRO',
  PLUS: 'PLUS',
}
const Permission = {
  NAVIGATION: 'NAVIGATION',
}

const StoreSettingMiddleware = {
  Status,
  AppPlan,
  Permission,

  init: async (session) => {
    try {
      const { shop, accessToken, scope } = session

      let storeSetting = await Repository.findOne({ shop })
        .then((res) => res)
        .catch((err) => null)

      if (!storeSetting) {
        /**
         * Init new store setting
         */
        storeSetting = await Repository.create({
          shop,
          accessToken,
          scope,
          testStore: process.env.SHOP === shop ? true : false,
        })
      }

      // if (
      //   storeSetting.accessToken !== accessToken ||
      //   storeSetting.scope !== scope ||
      //   storeSetting.status !== Status.RUNNING
      // ) {
      //   /**
      //    * Update store has changed
      //    */
      //   storeSetting = await Repository.update(storeSetting.id, {
      //     accessToken,
      //     scope,
      //     status: Status.RUNNING,
      //   })
      // }

      return storeSetting
    } catch (error) {
      throw error
    }
  },

  count: async (where) => {
    return await Repository.count(where)
  },

  find: async (filter) => {
    return await Repository.find(filter)
  },

  findById: async (id) => {
    return await Repository.findById(id)
  },

  findOne: async (where) => {
    return await Repository.findOne(where)
  },

  create: async (data) => {
    return await Repository.create(data)
  },

  update: async (id, data) => {
    return await Repository.update(id, data)
  },

  delete: async (id) => {
    return await Repository.delete(id)
  },
}

export default StoreSettingMiddleware
