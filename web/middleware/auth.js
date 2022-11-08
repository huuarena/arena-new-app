import { Shopify } from '@shopify/shopify-api'
import { gdprTopics } from '@shopify/shopify-api/dist/webhooks/registry.js'
import StoreSettingMiddleware from '../backend/middlewares/store_setting.js'
import WebhookMiddleware from '../backend/middlewares/webhook.js'

import ensureBilling from '../helpers/ensure-billing.js'
import redirectToAuth from '../helpers/redirect-to-auth.js'

export default function applyAuthMiddleware(
  app,
  { billing = { required: false } } = { billing: { required: false } }
) {
  app.get('/api/auth', async (req, res) => {
    console.log('applyAuthMiddleware /api/auth')
    return redirectToAuth(req, res, app)
  })

  app.get('/api/auth/callback', async (req, res) => {
    console.log('applyAuthMiddleware /api/auth/callback')
    try {
      const session = await Shopify.Auth.validateAuthCallback(req, res, req.query)
      console.log('session :>> ', session)

      if (session) {
        /**
         * Init store setting
         */
        let storeSetting = await StoreSettingMiddleware.init(session)
          .then((_res) => _res)
          .catch((_err) => null)
        console.log('storeSetting :>> ', storeSetting)

        if (storeSetting) {
          /**
           * Register webhooks
           */
          if (!storeSetting.acceptedAt) {
            process.env.WEBHOOKS.replace(/ /gm, '')
              .split(',')
              .forEach((topic) =>
                WebhookMiddleware.create({
                  shop: session.shop,
                  accessToken: session.accessToken,
                  topic,
                })
              )
          }
        }
      }

      const responses = await Shopify.Webhooks.Registry.registerAll({
        shop: session.shop,
        accessToken: session.accessToken,
      })

      Object.entries(responses).map(([topic, response]) => {
        // The response from registerAll will include errors for the GDPR topics.  These can be safely ignored.
        // To register the GDPR topics, please set the appropriate webhook endpoint in the
        // 'GDPR mandatory webhooks' section of 'App setup' in the Partners Dashboard.
        if (!response.success && !gdprTopics.includes(topic)) {
          if (response.result.errors) {
            console.log(`Failed to register ${topic} webhook: ${response.result.errors[0].message}`)
          } else {
            console.log(
              `Failed to register ${topic} webhook: ${JSON.stringify(
                response.result.data,
                undefined,
                2
              )}`
            )
          }
        }
      })

      // If billing is required, check if the store needs to be charged right away to minimize the number of redirects.
      if (billing.required) {
        const [hasPayment, confirmationUrl] = await ensureBilling(session, billing)

        if (!hasPayment) {
          return res.redirect(confirmationUrl)
        }
      }

      const host = Shopify.Utils.sanitizeHost(req.query.host)
      const redirectUrl = Shopify.Context.IS_EMBEDDED_APP
        ? Shopify.Utils.getEmbeddedAppUrl(req)
        : `/?shop=${session.shop}&host=${encodeURIComponent(host)}`

      res.redirect(redirectUrl)
    } catch (e) {
      console.warn(e)

      switch (true) {
        case e instanceof Shopify.Errors.InvalidOAuthError:
          res.status(400)
          res.send(e.message)
          break
        case e instanceof Shopify.Errors.CookieNotFound:
        case e instanceof Shopify.Errors.SessionNotFound:
          // This is likely because the OAuth session cookie expired before the merchant approved the request
          return redirectToAuth(req, res, app)
          break
        default:
          res.status(400)
          res.send(e.message)
          break
      }
    }
  })
}
