import apiCaller from '../helpers/apiCaller'

const ThemeApi = {
  find: async (query) => {
    return await apiCaller(`/api/themes`)
  },

  findById: async (id) => {
    return await apiCaller(`/api/themes/${id}`)
  },
}

export default ThemeApi
