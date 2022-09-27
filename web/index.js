import dotenv from 'dotenv'
dotenv.config({ path: './../.env' })

// @ts-check
import { join } from 'path'
import { readFileSync } from 'fs'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import bodyParser from 'body-parser'
import fs from 'fs'

import { Shopify, LATEST_API_VERSION } from '@shopify/shopify-api'

import applyAuthMiddleware from './middleware/auth.js'
import verifyRequest from './middleware/verify-request.js'
import { setupGDPRWebHooks } from './gdpr.js'
import productCreator from './helpers/product-creator.js'
import redirectToAuth from './helpers/redirect-to-auth.js'
import { BillingInterval } from './helpers/ensure-billing.js'
import { AppInstallations } from './app_installations.js'

import webhookRoute from './backend/routes/webhook/index.js'
import storeSettingRoute from './backend/routes/admin/store_setting.js'
import productRoute from './backend/routes/admin/product.js'
import billingRoute from './backend/routes/admin/billing.js'
import submitionRoute from './backend/routes/admin/submition.js'

const USE_ONLINE_TOKENS = false

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10)

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`

// const DB_PATH = `${process.cwd()}/database.sqlite`;
const { POSTGRES_USER, POSTGRES_HOST, POSTGRES_DB, POSTGRES_PWD, POSTGRES_PORT } = process.env
const POSTGRES_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PWD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ''),
  HOST_SCHEME: process.env.HOST.split('://')[0],
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  // SESSION_STORAGE: new Shopify.Session.SQLiteSessionStorage(DB_PATH),
  SESSION_STORAGE: new Shopify.Session.PostgreSQLSessionStorage(POSTGRES_URL),
})

Shopify.Webhooks.Registry.addHandler('APP_UNINSTALLED', {
  path: '/api/webhooks',
  webhookHandler: async (_topic, shop, _body) => {
    await AppInstallations.delete(shop)
  },
})

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
  try {
    const app = express()

    app.use(cors())

    app.set('use-online-tokens', USE_ONLINE_TOKENS)
    app.use(cookieParser(Shopify.Context.API_SECRET_KEY))

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))

    // -------------------------------------------
    /**
     * STOREFRONT ROUTES
     */
    // -------------------------------------------

    applyAuthMiddleware(app, {
      billing: billingSettings,
    })

    // -------------------------------------------
    /**
     * WEBHOOK ROUTES
     */
    webhookRoute(app)
    // -------------------------------------------

    // All endpoints after this point will require an active session
    app.use('/api/*', verifyRequest(app, { billing: billingSettings }))

    // -------------------------------------------
    /**
     * ADMIN ROUTES
     */
    storeSettingRoute(app)
    productRoute(app)
    billingRoute(app)
    submitionRoute(app)
    // -------------------------------------------

    // All endpoints after this point will have access to a request.body
    // attribute, as a result of the express.json() middleware
    app.use(express.json())

    app.use((req, res, next) => {
      const shop = Shopify.Utils.sanitizeShop(req.query.shop)
      if (Shopify.Context.IS_EMBEDDED_APP && shop) {
        res.setHeader(
          'Content-Security-Policy',
          `frame-ancestors https://${encodeURIComponent(shop)} https://admin.shopify.com;`
        )
      } else {
        res.setHeader('Content-Security-Policy', `frame-ancestors 'none';`)
      }
      next()
    })

    if (isProd) {
      const compression = await import('compression').then(({ default: fn }) => fn)
      const serveStatic = await import('serve-static').then(({ default: fn }) => fn)
      app.use(compression())
      app.use(serveStatic(PROD_INDEX_PATH, { index: false }))
    }

    app.use('/*', async (req, res, next) => {
      // redirect install page
      if (req.baseUrl.includes('/install')) {
        const installFilePath = join(process.cwd(), 'public', 'install.html')
        return res
          .status(200)
          .set('Content-Type', 'text/html')
          .send(fs.readFileSync(installFilePath))
      }

      if (typeof req.query.shop !== 'string') {
        res.status(500)
        return res.send('No shop provided')
      }

      const shop = Shopify.Utils.sanitizeShop(req.query.shop)
      const appInstalled = await AppInstallations.includes(shop)

      if (!appInstalled) {
        return redirectToAuth(req, res, app)
      }

      if (Shopify.Context.IS_EMBEDDED_APP && req.query.embedded !== '1') {
        const embeddedUrl = Shopify.Utils.getEmbeddedAppUrl(req)

        return res.redirect(embeddedUrl + req.path)
      }

      const htmlFile = join(isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH, 'index.html')

      return res.status(200).set('Content-Type', 'text/html').send(readFileSync(htmlFile))
    })

    return { app }
  } catch (error) {
    console.log(error)
  }
}

createServer().then(({ app }) =>
  app.listen(PORT, () => {
    console.log(`++++++++++++++++++++++++++++++++++++`)
    console.log(`+                                  +`)
    console.log(`+   Welcome to ArenaCommerce App   +`)
    console.log(`+                                  +`)
    console.log(`++++++++++++++++++++++++++++++++++++`)
    console.log(``)
    console.log(`${process.env.HOST}/api/auth?shop=${process.env.SHOP}`)
    console.log(``)
  })
)
