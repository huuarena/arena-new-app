import { Shopify } from '@shopify/shopify-api'
import StoreSettingMiddleware from '../backend/middlewares/store_setting.js'

const TEST_GRAPHQL_QUERY = `
{
  shop {
    name
  }
}`

export default async function redirectToAuth(req, res, app) {
  console.log('redirectToAuth')
  try {
    if (!req.query.shop) {
      return res.status(400).send('No shop provided')
    }

    /**
     * Check app is installed
     */
    let storeSetting = await StoreSettingMiddleware.findOne({ shop: req.query.shop })
      .then((_res) => _res)
      .catch((_err) => null)
    console.log('storeSetting :>> ', storeSetting)

    if (storeSetting.status !== StoreSettingMiddleware.Status.INSTALLED) {
      console.log('StoreSettingMiddleware.Status.INSTALLED')
      return res.status(401).send('Unauthorized')
    }

    if (storeSetting) {
      try {
        // Make a request to ensure the access token is still valid. Otherwise, re-authenticate the user.
        const client = new Shopify.Clients.Graphql(storeSetting.shop, storeSetting.accessToken)
        await client.query({ data: TEST_GRAPHQL_QUERY })

        return res.status(401).send('Unauthorized')
      } catch (error) {
        // continue
        console.log('check access token error :>> ', error.message)
      }
    }

    console.log(`---------------------continue`)

    if (req.query.embedded === '1') {
      return clientSideRedirect(req, res)
    }

    return await serverSideRedirect(req, res, app)
  } catch (error) {
    console.log('redirectToAuth error :>> ', error.message)
    return res.status(401).send('Unauthorized')
  }
}

function clientSideRedirect(req, res) {
  console.log('clientSideRedirect')
  try {
    const shop = Shopify.Utils.sanitizeShop(req.query.shop)
    const redirectUriParams = new URLSearchParams({
      shop,
      host: req.query.host,
    }).toString()
    const queryParams = new URLSearchParams({
      ...req.query,
      shop,
      redirectUri: `https://${Shopify.Context.HOST_NAME}/api/auth?${redirectUriParams}`,
    }).toString()

    return res.redirect(`/exitiframe?${queryParams}`)
  } catch (error) {
    console.log('clientSideRedirect error :>> ', error.message)
    return res.status(401).send(error.message)
  }
}

async function serverSideRedirect(req, res, app) {
  console.log('serverSideRedirect')
  try {
    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      '/api/auth/callback',
      app.get('use-online-tokens')
    )

    return res.redirect(redirectUrl)
  } catch (error) {
    console.log('serverSideRedirect error :>> ', error.message)
    return res.status(401).send(error.message)
  }
}
