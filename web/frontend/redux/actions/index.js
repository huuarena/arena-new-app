import * as appLoading from './appLoading'
import * as notify from './notify'
import * as storeSetting from './storeSetting'
import * as appBillings from './appBillings'
import * as privacy from './privacy'
import * as faqs from './faqs'
import * as productVendors from './productVendors'
import * as productTypes from './productTypes'

export default {
  ...appLoading,
  ...notify,
  ...storeSetting,
  ...appBillings,
  ...privacy,
  ...faqs,
  ...productVendors,
  ...productTypes,
}
