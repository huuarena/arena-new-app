import ThemeApi from '../../apis/theme'
import slices from '../slices'

export const setThemes = async (dispatch, data) => {
  try {
    return dispatch(slices.themes.actions.setData(data))
  } catch (error) {
    dispatch(slices.notify.actions.showNotify({ message: error.message, error: true }))
  }
}

export const getThemes = async (dispatch) => {
  try {
    let res = await ThemeApi.find()
    if (!res.success) throw res.error

    return dispatch(slices.themes.actions.setData(res.data.themes))
  } catch (error) {
    dispatch(slices.notify.actions.showNotify({ message: error.message, error: true }))
  }
}
