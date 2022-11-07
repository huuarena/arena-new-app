import AppManagementApi from '../../apis/app_management.js'
import slices from '../slices'

export const getPrivacy = async (dispatch) => {
  try {
    let res = await AppManagementApi.getPrivacy()
    if (!res.success) throw res.error

    return dispatch(slices.privacy.actions.setData(res.data))
  } catch (error) {
    dispatch(slices.notify.actions.showNotify({ message: error.message, error: true }))
  }
}
