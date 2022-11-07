import slices from '../slices'

export const showAppLoading = (dispatch) => {
  dispatch(slices.appLoading.actions.showAppLoading())
}

export const hideAppLoading = (dispatch) => {
  dispatch(slices.appLoading.actions.hideAppLoading())
}
