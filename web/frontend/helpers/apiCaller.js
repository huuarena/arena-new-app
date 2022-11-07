import axios from 'axios'
import { getSessionToken } from '@shopify/app-bridge-utils'
import { createApp } from '@shopify/app-bridge'

/**
 * Shopify API response status and error codes
 * https://shopify.dev/api/usage/response-codes
 */

const apiCaller = async (endpoint, method = 'GET', data = undefined, extraHeaders = undefined) => {
  try {
    let token = await getSessionToken(createApp(window.SHOPIFY_APP))

    let axiosConfig = {
      url: window.BACKEND_URL + endpoint,
      method: method || 'GET',
      data: data || undefined,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(extraHeaders ? extraHeaders : {}),
      },
    }

    const res = await axios(axiosConfig)

    return res.data
  } catch (error) {
    /**
     * Check Forbidden error
     */
    if (error.response?.status === 403) {
      window.location.replace(`${window.BACKEND_URL}/api/auth?shop=${window.shopOrigin}`)
    }

    return {
      success: false,
      error: error.response?.data?.message ? error.response.data : error.message,
      status: error.response?.status,
    }
  }
}

export default apiCaller
