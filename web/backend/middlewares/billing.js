import apiCaller from '../helpers/apiCaller.js'
import StoreSettingRepository from './../repositories/store_setting.js'

export const APP_BILLINGS = [
  // {
  //   id: 1001,
  //   type: 'application_charge',
  //   name: 'Application Charge',
  //   plan: null,
  //   price: {
  //     BASIC: 9.99,
  //     PRO: 9.99,
  //     PLUS: 9.99,
  //   },
  //   credits: {
  //     BASIC: 200000,
  //     PRO: 250000,
  //     PLUS: 300000,
  //   },
  //   features: [],
  //   extra: [],
  // },
  {
    id: 2001,
    type: 'recurring_application_charge',
    name: 'Recurring Application Charge - BASIC',
    plan: 'BASIC',
    price: 0,
    credits: null,
    features: [
      {
        label: 'EXPORT / IMPORT FILES:',
        supported: true,
      },
      {
        label: '100 Products',
        supported: true,
      },
      {
        label: '20 Custom collections',
        supported: true,
      },
      {
        label: '20 Smart collections',
        supported: true,
      },
      {
        label: '20 Pages',
        supported: true,
      },
      {
        label: '20 Blog posts',
        supported: true,
      },
      {
        label: '20 Redirects',
        supported: true,
      },
      {
        label: '20 Shop metafields',
        supported: true,
      },
      {
        label: 'Files export',
        supported: false,
      },
      {
        label: 'Themes export',
        supported: false,
      },
      {
        label: 'Supports',
        supported: true,
      },
    ],
    extra: [],
  },
  {
    id: 2002,
    type: 'recurring_application_charge',
    name: 'Recurring Application Charge - PRO',
    plan: 'PRO',
    price: 59,
    credits: null,
    features: [
      {
        label: 'EXPORT / IMPORT FILES:',
        supported: true,
      },
      {
        label: 'Up to 5,000 Products',
        supported: true,
      },
      {
        label: 'Up to 500 Custom collections',
        supported: true,
      },
      {
        label: 'All Smart collections',
        supported: true,
      },
      {
        label: '1,000 Pages',
        supported: true,
      },
      {
        label: '1,000 Blog posts',
        supported: true,
      },
      {
        label: 'All Redirects',
        supported: true,
      },
      {
        label: 'All Shop metafields',
        supported: true,
      },
      {
        label: 'All Files export',
        supported: true,
      },
      {
        label: '100 Themes export',
        supported: true,
      },
      {
        label: 'Supports',
        supported: true,
      },
    ],
    extra: [],
  },
  // {
  //   id: 2003,
  //   type: 'recurring_application_charge',
  //   name: 'Recurring Application Charge - PLUS',
  //   plan: 'PLUS',
  //   price: 16.99,
  //   credits: null,
  //   features: [],
  //   extra: [],
  // },
]

const getAppBillings = () => {
  try {
    return APP_BILLINGS
  } catch (error) {
    throw error
  }
}

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
    let appBilling = APP_BILLINGS.find((item) => item.id == id)
    if (!appBilling) {
      throw new Error('Invalid app billing')
    }

    let storeSetting = await StoreSettingRepository.findOne({ shop })
    if (!storeSetting) {
      throw new Error('Invalid session')
    }

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
              return_url: `${process.env.HOST}/api/auth?shop=${shop}`,
              test: storeSetting.testStore,
            },
          },
        })
        billing = billing[appBilling.type]

        billings.push({
          id: billing.id,
          name: billing.name,
          price: billing.price,
          status: billing.status,
          test: billing.test,
          app_billing_id: appBilling.id,
          type: appBilling.type,
        })

        // update store setting
        storeSetting = await StoreSettingRepository.update(storeSetting.id, { billings })
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
              endpoint: `recurring_application_charges/${item.id}.json`,
              method: 'DELETE',
            })
              .then((res) => null)
              .catch((err) => null)
          )

        billings = billings.filter((item) => item.type !== 'recurring_application_charge')

        // update store setting
        storeSetting = await StoreSettingRepository.update(storeSetting.id, {
          billings,
          appPlan: 'BASIC',
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
              return_url: `${process.env.HOST}/api/auth?shop=${shop}`,
              test: storeSetting.testStore,
            },
          },
        })
          .then((res) => res[appBilling.type])
          .catch((err) => {
            throw err
          })

        billings.push({
          id: billing.id,
          name: billing.name,
          price: billing.price,
          status: billing.status,
          test: billing.test,
          app_billing_id: appBilling.id,
          type: appBilling.type,
        })

        // update store setting
        storeSetting = await StoreSettingRepository.update(storeSetting.id, { billings })
        break

      default:
        break
    }

    return billing
  } catch (error) {
    throw error
  }
}

const BillingMiddleware = {
  getAppBillings,
  get,
  create,
}

export default BillingMiddleware
