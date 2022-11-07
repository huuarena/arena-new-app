import axios from 'axios'

const apiCaller = async ({ endpoint, method, data, extraHeaders }) => {
  try {
    let token = process.env.ENVATO_TOKEN

    let config = {
      url: `https://api.envato.com/v3${endpoint}`,
      method: method || 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json; charset=utf-8',
        ...(extraHeaders || {}),
      },
      data,
    }

    let res = await axios(config)

    return res.data
  } catch (error) {
    if (error.response?.data) {
      if (error.response?.data?.message) {
        throw error.response?.data
      }

      throw { message: JSON.stringify(error.response?.data) }
    }

    throw error
  }
}

const EnvatoApi = {
  verifyCode: async ({ code }) => {
    try {
      return await apiCaller({ endpoint: `/market/author/sale?code=${code}` })
    } catch (error) {
      console.log('EnvatoApi.verifyCode error :>> ', error)
      throw error
    }
  },
}

export default EnvatoApi
