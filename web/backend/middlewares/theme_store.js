import Repository from '../repositories/theme_store.js'

const ThemeStoreMiddleware = {
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
    /**
     * Check already taken
     */
    let entry = await Repository.findOne({
      theme: data.theme,
      shop: data.shop,
    })
      .then((res) => res)
      .catch((err) => null)

    if (!entry) {
      entry = await Repository.create(data)
    }

    return entry
  },

  update: async (id, data) => {
    return await Repository.update(id, data)
  },

  delete: async (id) => {
    return await Repository.delete(id)
  },
}

export default ThemeStoreMiddleware
