import Repository from '../repositories/envato_purchase_code.js'

const EnvatoPurchaseCodeMiddleware = {
  active: async ({ code, shop }) => {
    /**
     * Check already taken
     */
    let entry = await Repository.findOne({ code })
      .then((res) => res)
      .catch((err) => null)

    if (entry) {
      if (entry.shops.includes(shop)) {
        return entry
      } else {
        if (entry.shops.length >= 2) {
          throw new Error('You can only active purchase code up to 2 stores')
        }

        entry = await Repository.update(entry.id, { code, shops: [...entry.shops, shop] })
      }
    }

    if (!entry) {
      entry = await Repository.create({ code, shops: [shop] })
    }

    return entry
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

export default EnvatoPurchaseCodeMiddleware
