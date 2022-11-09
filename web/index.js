import dotenv from 'dotenv'
dotenv.config({ path: './../.env' })

// @ts-check
import { join } from 'path'
import { readFileSync } from 'fs'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import { Shopify, LATEST_API_VERSION } from '@shopify/shopify-api'

import applyAuthMiddleware from './middleware/auth.js'
import verifyRequest from './middleware/verify-request.js'
import { setupGDPRWebHooks } from './gdpr.js'
import productCreator from './helpers/product-creator.js'
import redirectToAuth from './helpers/redirect-to-auth.js'
import { BillingInterval } from './helpers/ensure-billing.js'
import { AppInstallations } from './app_installations.js'
import storeSettingRoute from './backend/routes/store_setting.js'
import productRoute from './backend/routes/product.js'
import billingRoute from './backend/routes/billing.js'
import submitionRoute from './backend/routes/submition.js'
import themeRoute from './backend/routes/theme.js'
import ticketRoute from './backend/routes/ticket.js'
import appManagementRoute from './backend/routes/app_management.js'
import backgroundJobRoute from './backend/routes/background_job.js'
import clearStoreRoute from './backend/routes/clear_store.js'
import uniqueCodeRoute from './backend/routes/unique_code.js'
import duplicatorRoute from './backend/routes/duplicator.js'
import duplicatorPackageRoute from './backend/routes/duplicator_package.js'
import storefrontRoute from './backend/routes/storefront.js'
import webhookRoute from './backend/routes/webhook.js'

const USE_ONLINE_TOKENS = false

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10)

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`

const DB_PATH = `${process.cwd()}/database.sqlite`

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ''),
  HOST_SCHEME: process.env.HOST.split('://')[0],
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  // See note below regarding using CustomSessionStorage with this template.
  SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH),
  ...(process.env.SHOP_CUSTOM_DOMAIN && { CUSTOM_SHOP_DOMAINS: [process.env.SHOP_CUSTOM_DOMAIN] }),
})

// NOTE: If you choose to implement your own storage strategy using
// Shopify.Session.CustomSessionStorage, you MUST implement the optional
// findSessionsByShopCallback and deleteSessionsCallback methods.  These are
// required for the app_installations.js component in this template to
// work properly.

// Shopify.Webhooks.Registry.addHandler('APP_UNINSTALLED', {
//   path: '/api/webhooks',
//   webhookHandler: async (_topic, shop, _body) => {
//     await AppInstallations.delete(shop)
//   },
// })

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const BILLING_SETTINGS = {
  required: false,
  // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  // chargeName: "My Shopify One-Time Charge",
  // amount: 5.0,
  // currencyCode: "USD",
  // interval: BillingInterval.OneTime,
}

// This sets up the mandatory GDPR webhooks. You’ll need to fill in the endpoint
// in the “GDPR mandatory webhooks” section in the “App setup” tab, and customize
// the code when you store customer data.
//
// More details can be found on shopify.dev:
// https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
setupGDPRWebHooks('/api/webhooks')

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  billingSettings = BILLING_SETTINGS
) {
  const app = express()

  app.use(cors())
  // app.use(morgan('tiny'))

  app.set('use-online-tokens', USE_ONLINE_TOKENS)
  app.use(cookieParser(Shopify.Context.API_SECRET_KEY))

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  // -------------------------------------------
  /**
   * STOREFRONT ROUTES
   */
  storefrontRoute(app)
  // -------------------------------------------

  applyAuthMiddleware(app, { billing: billingSettings })

  // Do not call app.use(express.json()) before processing webhooks with
  // Shopify.Webhooks.Registry.process().
  // See https://github.com/Shopify/shopify-api-node/blob/main/docs/usage/webhooks.md#note-regarding-use-of-body-parsers
  // for more details.
  webhookRoute(app)

  // All endpoints after this point will require an active session
  app.use('/api/*', verifyRequest(app, { billing: billingSettings }))

  // -------------------------------------------
  /**
   * ADMIN ROUTES
   */
  storeSettingRoute(app)
  productRoute(app)
  billingRoute(app)
  duplicatorPackageRoute(app)
  submitionRoute(app)
  themeRoute(app)
  ticketRoute(app)
  appManagementRoute(app)
  backgroundJobRoute(app)
  clearStoreRoute(app)
  uniqueCodeRoute(app)
  duplicatorRoute(app)
  // -------------------------------------------

  app.get('/api/products/count', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'))
      const { Product } = await import(
        `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
      )

      const countData = await Product.count({ session })
      res.status(200).send(countData)
    } catch (error) {
      return res.status(400).send(error.message)
    }
  })

  app.get('/api/products/create', async (req, res) => {
    try {
      const session = await Shopify.Utils.loadCurrentSession(req, res, app.get('use-online-tokens'))
      let status = 200
      let error = null

      try {
        await productCreator(session)
      } catch (e) {
        console.log(`Failed to process products/create: ${e.message}`)
        status = 500
        error = e.message
      }
      res.status(status).send({ success: status === 200, error })
    } catch (error) {
      return res.status(400).send(error.message)
    }
  })

  // All endpoints after this point will have access to a request.body
  // attribute, as a result of the express.json() middleware
  app.use(express.json())

  app.use((req, res, next) => {
    try {
      const shop = Shopify.Utils.sanitizeShop(req.query.shop)
      if (Shopify.Context.IS_EMBEDDED_APP && shop) {
        res.setHeader(
          'Content-Security-Policy',
          `frame-ancestors https://${encodeURIComponent(shop)} https://admin.shopify.com;`
        )
      } else {
        res.setHeader('Content-Security-Policy', `frame-ancestors 'none';`)
      }

      res.setHeader('X-Frame-Options', `DENY`)

      next()
    } catch (error) {
      return res.status(400).send(error.message)
    }
  })

  if (isProd) {
    const compression = await import('compression').then(({ default: fn }) => fn)
    const serveStatic = await import('serve-static').then(({ default: fn }) => fn)
    app.use(compression())
    app.use(serveStatic(PROD_INDEX_PATH, { index: false }))
  }

  app.use('/*', async (req, res, next) => {
    try {
      console.log('req.url :>> ', req.url)

      // redirect install page
      if (['/', '/install'].includes(req.url)) {
        const filepath = join(process.cwd(), 'public', 'install.html')
        return res.status(200).set('Content-Type', 'text/html').send(readFileSync(filepath))
      }

      // if (typeof req.query.shop !== 'string') {
      //   return res.status(400).send('No shop provided')
      // }

      const shop = Shopify.Utils.sanitizeShop(req.query.shop)
      const appInstalled = await AppInstallations.includes(shop)

      if (!appInstalled && !req.originalUrl.match(/^\/exitiframe/i)) {
        return redirectToAuth(req, res, app)
      }

      if (Shopify.Context.IS_EMBEDDED_APP && req.query.embedded !== '1') {
        const embeddedUrl = Shopify.Utils.getEmbeddedAppUrl(req)

        return res.redirect(embeddedUrl + req.path)
      }

      if (Shopify.Context.IS_EMBEDDED_APP && shop) {
        res.setHeader(
          'Content-Security-Policy',
          `frame-ancestors https://${encodeURIComponent(shop)} https://admin.shopify.com;`
        )
      } else {
        res.setHeader('Content-Security-Policy', `frame-ancestors 'none';`)
      }

      const htmlFile = join(isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH, 'index.html')

      return res.status(200).set('Content-Type', 'text/html').send(readFileSync(htmlFile))
    } catch (error) {
      return res.status(400).send(error.message)
    }
  })

  return { app }
}

createServer().then(({ app }) =>
  app.listen(PORT, () => {
    console.log(``)
    console.log(` ++++++++++++++++++++++++++++++++++++`)
    console.log(` +                                  +`)
    console.log(` +   Welcome to ArenaCommerce App   +`)
    console.log(` +                                  +`)
    console.log(` ++++++++++++++++++++++++++++++++++++`)
    console.log(``)
    console.log(` Install link:`)
    console.log(` ${process.env.HOST}/api/auth?shop=${process.env.SHOP}`)
    console.log(``)
    console.log(` Shopify app:`)
    console.log(` https://${process.env.SHOP}/admin/apps/${process.env.SHOPIFY_API_KEY}/`)
    console.log(``)
  })
)
