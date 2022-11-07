import apiCaller from '../helpers/apiCaller'

const ClearStoreApi = {
  clear: async (data) => {
    return await apiCaller(`/api/clear-store`, 'POST', data)
  },
}

export default ClearStoreApi
