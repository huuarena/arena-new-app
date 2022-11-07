import UniqueCodeApi from '../../apis/unique_code'
import slices from '../slices'

export const getUniqueCodes = async (dispatch) => {
  try {
    let res = await UniqueCodeApi.getAll()
    if (!res.success) throw res.error

    return dispatch(slices.uniqueCodes.actions.setData(res.data))
  } catch (error) {
    dispatch(slices.notify.actions.showNotify({ message: error.message, error: true }))
  }
}
