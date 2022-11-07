import Repository from '../repositories/unique_code.js'

const Permission = {
  ALL: 'ALL',
  THEME_DEMO: 'THEME_DEMO',
}
const Status = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  LOCKED: 'LOCKED',
}

const UniqueCodeMiddleware = {
  Permission,
  Status,

  getAll: async (where) => {
    return await Repository.getAll(where)
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
    /**
     * Check already taken
     */
    let entry = await Repository.findOne({
      shop: data.shop,
      permission: data.permission || Permission.ALL,
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

export default UniqueCodeMiddleware
