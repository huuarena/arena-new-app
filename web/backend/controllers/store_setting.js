import verifyToken from '../auth/verifyToken.js'
import ResponseHandler from '../helpers/responseHandler.js'
import StoreSettingMiddleware from '../middlewares/store_setting.js'
import BillingMiddleware, { APP_BILLINGS } from '../middlewares/billing.js'

export default {
  auth: async (req, res) => {
    try {
      const session = await verifyToken(req, res)

      let storeSetting = await StoreSettingMiddleware.init(session)

      /**
       * Check billings
       */
      if (storeSetting.billings.length) {
        let billings = storeSetting.billings
        let updated = false

        for (let i = 0; i < billings.length; i++) {
          if (['pending', 'active'].includes(billings[i].status)) {
            let billing = await BillingMiddleware.get({
              shop: session.shop,
              accessToken: session.accessToken,
              type: billings[i].type,
              id: billings[i].id,
            })
            billing = billing[billings[i].type]

            if (!billing) {
              updated = true
              billings[i] = null
            } else {
              if (billing.status !== billings[i].status) {
                updated = true
                billings[i] = { ...billings[i], status: billing.status }

                if (billing.status === 'active') {
                  let appBilling = APP_BILLINGS.find(
                    (item) => item.id === billings[i].app_billing_id
                  )

                  switch (billings[i].type) {
                    case 'application_charge':
                      storeSetting.credits += appBilling.credits[storeSetting.appPlan]
                      break

                    case 'recurring_application_charge':
                      storeSetting.appPlan = appBilling.plan
                      break

                    default:
                      break
                  }
                }
              }
            }
          }
        }

        if (updated) {
          // remove draft billings
          billings = billings
            .filter((item) => item)
            .filter((item) => ['pending', 'active'].includes(item.status))

          storeSetting = await StoreSettingMiddleware.update(storeSetting.id, {
            billings,
            appPlan: storeSetting.appPlan,
            credits: storeSetting.credits,
          })
        }
      }

      return ResponseHandler.success(res, storeSetting)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  update: async (req, res) => {
    try {
      const session = await verifyToken(req, res)

      const { acceptedAt } = req.body

      let storeSetting = await StoreSettingMiddleware.findOne({ shop: session.shop })

      storeSetting = await StoreSettingMiddleware.update(storeSetting.id, { acceptedAt })

      return ResponseHandler.success(res, storeSetting)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },
}
