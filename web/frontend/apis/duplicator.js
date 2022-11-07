import apiCaller from '../helpers/apiCaller'

const DuplicatorApi = {
  activeCode: async (data) => await apiCaller(`/api/duplicators-active-code`, 'POST', data),
  getAll: async () => await apiCaller(`/api/duplicators-all`),
  find: async (query) => await apiCaller(`/api/duplicators${query || ''}`),
  findById: async (id) => await apiCaller(`/api/duplicators/${id}`),
  create: async (data) => await apiCaller(`/api/duplicators`, 'POST', data),
  update: async (id, data) => await apiCaller(`/api/duplicators/${id}`, 'PUT', data),
  delete: async (id) => await apiCaller(`/api/duplicators/${id}`, 'DELETE'),
}

export default DuplicatorApi
