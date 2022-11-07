import apiCaller from '../helpers/apiCaller.js'

const getMain = async ({ shop, accessToken }) => {
  try {
    let themes = await apiCaller({
      shop,
      accessToken,
      endpoint: `themes.json`,
    })
    themes = themes.themes

    let theme = themes.find((item) => item.role === 'main')

    if (!theme) {
      throw new Error('Not found')
    }

    return theme
  } catch (error) {
    throw error
  }
}

const find = async ({ shop, accessToken }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes.json`,
    })
  } catch (error) {
    throw error
  }
}

const findById = async ({ shop, accessToken, id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${id}.json`,
    })
  } catch (error) {
    throw error
  }
}
const create = async ({ shop, accessToken, data }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes.json`,
      method: 'POST',
      data,
    })
  } catch (error) {
    throw error
  }
}

const update = async ({ shop, accessToken, id, data }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${id}.json`,
      method: 'PUT',
      data,
    })
  } catch (error) {
    throw error
  }
}

const _delete = async ({ shop, accessToken, id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${id}.json`,
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

const ThemeMiddleware = {
  getMain,
  find,
  findById,
  create,
  update,
  delete: _delete,
}

export default ThemeMiddleware
