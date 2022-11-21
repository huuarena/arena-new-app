import { Shopify } from '@shopify/shopify-api'

export default async function redirectToAuth(req, res, app) {
  try {
    if (!req.query.shop) {
      return res.status(400).send('No shop provided')
    }

    await new Promise((resolve, reject) => setTimeout(() => resolve()), 1000)

    if (req.query.embedded === '1') {
      return clientSideRedirect(req, res)
    }

    return await serverSideRedirect(req, res, app)
  } catch (error) {
    console.log('redirectToAuth error :>> ', error.message)
    return res.status(401).send(error.message)
  }
}

function clientSideRedirect(req, res) {
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
    const redirectUrl = `/exitiframe?${queryParams}`

    return res.redirect(redirectUrl)
  } catch (error) {
    console.log('clientSideRedirect error :>> ', error.message)
    return res.status(401).send(error.message)
  }
}

async function serverSideRedirect(req, res, app) {
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
