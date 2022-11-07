import apiCaller from '../helpers/apiCaller.js'

const find = async ({ shop, accessToken, customerId }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `customers/${customerId}/addresses.json`,
      pageInfo: true,
    })
  } catch (error) {
    throw error
  }
}

const findById = async ({ shop, accessToken, customerId, id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `customers/${customerId}/addresses/${id}.json`,
    })
  } catch (error) {
    throw error
  }
}

const create = async ({ shop, accessToken, customerId, data }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `customers/${customerId}/addresses.json`,
      method: 'POST',
      data,
    })
  } catch (error) {
    throw error
  }
}

const update = async ({ shop, accessToken, customerId, id, data }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `customers/${customerId}/addresses/${id}.json`,
      method: 'PUT',
      data,
    })
  } catch (error) {
    throw error
  }
}

const _delete = async ({ shop, accessToken, customerId, id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `customers/${customerId}/addresses/${id}.json`,
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

const CustomerAddressMiddleware = {
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default CustomerAddressMiddleware
