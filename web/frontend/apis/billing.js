import apiCaller from '../helpers/apiCaller'

const BillingApi = {
  get: async () => {
    return await apiCaller(`/api/billings`)
  },

  create: async (id) => {
    return await apiCaller(`/api/billings`, 'POST', { id })
  },
}

export default BillingApi
