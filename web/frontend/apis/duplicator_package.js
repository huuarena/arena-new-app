import apiCaller from '../helpers/apiCaller'

const DuplicatorPackageApi = {
  export: async (data) => {
    return await apiCaller(`/api/duplicator-export`, 'POST', data)
  },

  import: async (data) => {
    return await apiCaller(`/api/duplicator-import`, 'POST', data)
  },

  checkCode: async (data) => {
    return await apiCaller(`/api/duplicator-check-code`, 'POST', data)
  },

  getAll: async (query) => {
    return await apiCaller(`/api/duplicator-packages-all${query || ''}`)
  },

  find: async (query) => {
    return await apiCaller(`/api/duplicator-packages${query || ''}`)
  },

  findById: async (id, query) => {
    return await apiCaller(`/api/duplicator-packages/${id}${query || ''}`)
  },

  update: async (id, data) => {
    return await apiCaller(`/api/duplicator-packages/${id}`, 'PUT', data)
  },

  delete: async (id) => {
    return await apiCaller(`/api/duplicator-packages/${id}`, 'DELETE')
  },
}

export default DuplicatorPackageApi
