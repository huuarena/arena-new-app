import axios from 'axios'

const { APP_MANAGEMENT_UID, APP_MANAGEMENT_BASE_URL } = process.env

const apiCaller = async ({ endpoint, method, data, extraHeaders }) => {
  try {
    const config = {
      url: `${APP_MANAGEMENT_BASE_URL}/api/${endpoint}`,
      method: method || 'GET',
      headers: {
        ...(extraHeaders || {}),
      },
      data,
    }

    const res = await axios(config)

    return res.data
  } catch (error) {
    throw error
  }
}

const AppManagementService = {
  getPrivacy: async () => {
    return await apiCaller({
      endpoint: `privacies?filters[app][uid]=${APP_MANAGEMENT_UID}`,
    })
  },

  getFaqs: async () => {
    return await apiCaller({
      endpoint: `faqs?filters[app][uid]=${APP_MANAGEMENT_UID}&pagination[page]=1&pagination[pageSize]=100&sort[0]=order:desc&sort[1]=updatedAt:desc`,
    })
  },
}

export default AppManagementService
