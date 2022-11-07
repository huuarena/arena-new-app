import AppManagementApi from '../../apis/app_management.js'
import slices from '../slices'

export const getFaqs = async (dispatch) => {
  try {
    let res = await AppManagementApi.getFaqs()
    if (!res.success) throw res.error

    return dispatch(slices.faqs.actions.setData(res.data))
  } catch (error) {
    dispatch(slices.notify.actions.showNotify({ message: error.message, error: true }))
  }
}
