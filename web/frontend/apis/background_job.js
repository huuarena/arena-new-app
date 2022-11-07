import apiCaller from '../helpers/apiCaller'

const BackgroundJobApi = {
  find: async (query) => {
    return await apiCaller(`/api/background-jobs${query || ''}`)
  },
}

export default BackgroundJobApi
