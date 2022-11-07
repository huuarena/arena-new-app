import StoreSettingMiddleware from '../middlewares/store_setting.js'
import crypto from 'crypto'

export default {
  get: (req, res) => res.status(401).send('Not Found'),

  process: (req, res) => {
    const hmac = req.headers['x-shopify-hmac-sha256']
    const domain = req.headers['x-shopify-shop-domain']
    const topic = req.headers['x-shopify-topic']

    try {
      const hash = crypto
        .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
        .update(JSON.stringify(req.body), 'utf8', 'hex')
        .digest('base64')

      if (!hmac || hash !== hmac) {
        /**
         * Request not sent from Shopify
         */
        return res.status(401).send('Not Found')
      }

      const { id } = req.body

      console.log(`🚀 ~ webhook ${domain} ${topic} ${id}`)

      switch (topic) {
        case 'app/uninstalled':
          StoreSettingMiddleware.findOne({ shop: domain })
            .then((res) => {
              StoreSettingMiddleware.update(res.id, {
                status: StoreSettingMiddleware.Status.UNINSTALLED,
                appPlan: StoreSettingMiddleware.AppPlan.BASIC,
                acceptedAt: null,
                billings: null,
              })
                .then((_res) => {})
                .catch((_err) => null)
            })
            .catch((err) => null)
          break

        default:
          break
      }

      res.status(200).send()
    } catch (error) {
      res.status(200).send()
    }
  },
}
