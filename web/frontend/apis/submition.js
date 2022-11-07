import apiCaller from '../helpers/apiCaller'

const SubmitionApi = {
  submit: async () => {
    return await apiCaller(`/api/submition`)
  },
}

export default SubmitionApi
