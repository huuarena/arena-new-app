import AppBillings from '../constants/app_billings.js'
import ErrorCodes from '../constants/errorCodes.js'
import apiCaller from '../helpers/apiCaller.js'
import StoreSettingMiddleware from './store_setting.js'

const getAppBillings = () => AppBillings

const get = async ({ shop, accessToken, type, id }) => {
  try {
    return await apiCaller({
      shop,
      accessToken,
      endpoint: `${type}s/${id}.json`,
    })
  } catch (error) {
    throw error
  }
}

const create = async ({ shop, accessToken, id }) => {
  try {
    let appBilling = AppBillings.find((item) => item.id == id)
    if (!appBilling) throw new Error(ErrorCodes.NOT_FOUND)

    let storeSetting = await StoreSettingMiddleware.findOne({ shop })
    if (!storeSetting) throw new Error(ErrorCodes.INVALID_SESSION)

    let billings = storeSetting.billings
    let billing = null

    switch (appBilling.id) {
      case 1001:
        // application_charge
        billing = await apiCaller({
          shop,
          accessToken,
          endpoint: `${appBilling.type}s.json`,
          method: 'POST',
          data: {
            [appBilling.type]: {
              name: appBilling.name,
              price: appBilling.price[storeSetting.appPlan],
              return_url: `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}/`,
              test: storeSetting.testStore,
            },
          },
        })
          .then((res) => {
            return res[appBilling.type]
          })
          .catch((err) => {
            throw err
          })

        billings.push({ ...billing, app_billing_id: appBilling.id, type: appBilling.type })

        // update store setting
        storeSetting = await StoreSettingMiddleware.update(storeSetting.id, { billings })
        break

      case 2001:
        // unsubscribe recurring_application_charge
        billings
          .filter(
            (item) => item.type === 'recurring_application_charge' && item.status === 'active'
          )
          .forEach((item) =>
            apiCaller({
              shop,
              accessToken,
              endpoint: `${item.type}s/${item.id}.json`,
              method: 'DELETE',
            })
              .then((res) => {})
              .catch((err) => {
                throw err
              })
          )

        billings = billings.filter(
          (item) => !(item.type === 'recurring_application_charge' && item.status === 'active')
        )

        // update store setting
        storeSetting = await StoreSettingMiddleware.update(storeSetting.id, {
          billings,
          appPlan: StoreSettingMiddleware.AppPlan.BASIC,
        })

        break

      case 2002:
      case 2003:
        // recurring_application_charge
        billing = await apiCaller({
          shop,
          accessToken,
          endpoint: `${appBilling.type}s.json`,
          method: 'POST',
          data: {
            [appBilling.type]: {
              name: appBilling.name,
              price: appBilling.price,
              return_url: `https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}/`,
              test: storeSetting.testStore,
            },
          },
        })
          .then((res) => {
            return res[appBilling.type]
          })
          .catch((err) => {
            throw err
          })

        billings.push({ ...billing, app_billing_id: appBilling.id, type: appBilling.type })

        // update store setting
        storeSetting = await StoreSettingMiddleware.update(storeSetting.id, { billings })
        break

      default:
        break
    }

    return billing
  } catch (error) {
    console.log('BillingMiddleware.create error :>> ', error.message)
    throw error
  }
}

const BillingMiddleware = {
  getAppBillings,
  get,
  create,
}

export default BillingMiddleware
