import * as appLoading from './appLoading'
import * as notify from './notify'
import * as storeSetting from './storeSetting'
import * as appBillings from './appBillings'
import * as themes from './themes'
import * as privacy from './privacy'
import * as faqs from './faqs'
import * as uniqueCodes from './uniqueCodes'
import * as duplicators from './duplicators'
import * as productVendors from './productVendors'
import * as productTypes from './productTypes'

export default {
  ...appLoading,
  ...notify,
  ...storeSetting,
  ...appBillings,
  ...themes,
  ...privacy,
  ...faqs,
  ...uniqueCodes,
  ...duplicators,
  ...productVendors,
  ...productTypes,
}
