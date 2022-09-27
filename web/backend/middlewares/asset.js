import apiCaller from '../helpers/apiCaller.js'
import validateParams from '../helpers/validateParams.js'
import ThemeMiddleware from './theme.js'

const find = async ({ shop, accessToken, themeId }) => {
  try {
    validateParams({ shop, accessToken })

    let _themeId = themeId
    if (!_themeId) {
      _themeId = await ThemeMiddleware.getMain({ shop, accessToken }).then((res) => res.id)
    }

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${_themeId}/assets.json`,
      pageInfo: true,
    })
  } catch (error) {
    throw error
  }
}

const findByKey = async ({ shop, accessToken, themeId, key }) => {
  try {
    validateParams({ shop, accessToken, key })

    let _themeId = themeId
    if (!_themeId) {
      _themeId = await ThemeMiddleware.getMain({ shop, accessToken }).then((res) => res.id)
    }

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${_themeId}/assets.json?asset[key]=${key}`,
    })
  } catch (error) {
    throw error
  }
}

const save = async ({ shop, accessToken, themeId, data }) => {
  try {
    validateParams({ shop, accessToken, data })

    let _themeId = themeId
    if (!_themeId) {
      _themeId = await ThemeMiddleware.getMain({ shop, accessToken }).then((res) => res.id)
    }

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${_themeId}/assets.json`,
      method: 'PUT',
      data,
    })
  } catch (error) {
    throw error
  }
}

const _delete = async ({ shop, accessToken, themeId, key }) => {
  try {
    validateParams({ shop, accessToken, key })

    let _themeId = themeId
    if (!_themeId) {
      _themeId = await ThemeMiddleware.getMain({ shop, accessToken }).then((res) => res.id)
    }

    return await apiCaller({
      shop,
      accessToken,
      endpoint: `themes/${_themeId}/assets.json?asset[key]=${key}`,
      method: 'DELETE',
    })
  } catch (error) {
    throw error
  }
}

const AssetMiddleware = {
  find,
  findByKey,
  save,
  delete: _delete,
}

export default AssetMiddleware
