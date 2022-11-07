import apiCaller from '../helpers/apiCaller'

const UniqueCodeApi = {
  getAll: async () => await apiCaller(`/api/unique-codes-all`),
  create: async (data) => await apiCaller(`/api/unique-codes`, `POST`, data),
  update: async (id, data) => await apiCaller(`/api/unique-codes/${id}`, `PUT`, data),
  delete: async (id) => await apiCaller(`/api/unique-codes/${id}`, `DELETE`),
}

export default UniqueCodeApi
