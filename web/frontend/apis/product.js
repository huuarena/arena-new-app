import apiCaller from '../helpers/apiCaller'

const ProductApi = {
  count: async () => {
    return await apiCaller(`/api/products/count`)
  },

  find: async (query) => {
    return await apiCaller(`/api/products${query || ''}`)
  },

  findById: async (id) => {
    return await apiCaller(`/api/products/${id}`)
  },

  create: async (data) => {
    return await apiCaller(`/api/products`, 'POST', data)
  },

  update: async (id, data) => {
    return await apiCaller(`/api/products/${id}`, 'PUT', data)
  },

  delete: async (id) => {
    return await apiCaller(`/api/products/${id}`, 'DELETE')
  },
}

export default ProductApi
