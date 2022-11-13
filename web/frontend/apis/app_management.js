import apiCaller from '../helpers/apiCaller'

const AppManagementApi = {
  getPrivacy: async () => await apiCaller(`/api/app-management-privacy`),
  getFaqs: async () => await apiCaller(`/api/app-management-faqs`),
}

export default AppManagementApi
