import apiCaller from '../helpers/apiCaller'

const StoreSettingApi = {
  auth: async () => {
    return await apiCaller('/api/store-settings')
  },

  update: async (data) => {
    return await apiCaller('/api/store-settings', 'PUT', data)
  },
}

export default StoreSettingApi
