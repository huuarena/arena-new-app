import appManagementRoute from './app_management.js'
import billingRoute from './billing.js'
import productRoute from './product.js'
import storeSettingRoute from './store_setting.js'
import submitionRoute from './submition.js'
import ticketRoute from './ticket.js'

export default function adminRoute(app) {
  appManagementRoute(app)
  billingRoute(app)
  productRoute(app)
  storeSettingRoute(app)
  submitionRoute(app)
  ticketRoute(app)
}
