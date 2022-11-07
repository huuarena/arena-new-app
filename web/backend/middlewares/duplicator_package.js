import Repository from '../repositories/duplicator_package.js'

const DuplicatorPackageMiddleware = {
  updateVersions: async (id, version) => {
    return await Repository.updateVersions(id, version)
  },

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
    return await Repository.create(data)
  },

  update: async (id, data) => {
    return await Repository.update(id, data)
  },

  delete: async (id) => {
    return await Repository.delete(id)
  },
}

export default DuplicatorPackageMiddleware
