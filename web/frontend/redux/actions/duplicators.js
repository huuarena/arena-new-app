import DuplicatorApi from '../../apis/duplicator'
import slices from '../slices'

export const getDuplicators = async (dispatch) => {
  try {
    let res = await DuplicatorApi.getAll()
    if (!res.success) throw res.error

    return dispatch(slices.duplicators.actions.setData(res.data))
  } catch (error) {
    dispatch(slices.notify.actions.showNotify({ message: error.message, error: true }))
  }
}
