import { Shopify } from '@shopify/shopify-api'

const TEST_GRAPHQL_QUERY = `
  {
    shop {
      name
    }
  }
`

export const AppInstallations = {
  includes: async function (shopDomain) {
    try {
      const shopSessions = await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain)

      if (shopSessions.length > 0) {
        for (const session of shopSessions) {
          if (session.accessToken) {
            try {
              // Make a request to ensure the access token is still valid. Otherwise, re-authenticate the user.
              const client = new Shopify.Clients.Graphql(session.shop, session.accessToken)
              await client.query({ data: TEST_GRAPHQL_QUERY })

              return true
            } catch (error) {
              await Shopify.Context.SESSION_STORAGE.deleteSessions(
                shopSessions.map((session) => session.id)
              )

              return false
            }
          }
        }
      }

      return false
    } catch (error) {
      return false
    }
  },

  delete: async function (shopDomain) {
    try {
      const shopSessions = await Shopify.Context.SESSION_STORAGE.findSessionsByShop(shopDomain)
      if (shopSessions.length > 0) {
        await Shopify.Context.SESSION_STORAGE.deleteSessions(
          shopSessions.map((session) => session.id)
        )
      }
    } catch (error) {}
  },
}
