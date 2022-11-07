import apiCaller from '../helpers/apiCaller'

const AppManagementApi = {
  getPrivacy: async () => {
    return await apiCaller(`/api/app-management-privacy`)
  },

  getFaqs: async () => {
    return await apiCaller(`/api/app-management-faqs`)
  },
}

export default AppManagementApi
