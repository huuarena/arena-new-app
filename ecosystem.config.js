require('dotenv').config()

const {
  NODE_ENV,
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  HOST,
  SCOPES,
  PORT,
  SERVER_PORT,
  BACKEND_PORT,
  SHOP,
  WEBHOOKS,
  API_VERSION,

  POSTGRES_USER,
  POSTGRES_PWD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,

  TICKET_URL,
  TICKET_AUTH,
  TICKET_GROUP,

  APP_MANAGEMENT_UID,
  APP_MANAGEMENT_BASE_URL,
} = process.env

module.exports = {
  apps: [
    {
      script: 'npm',
      args: 'run serve',
      env_production: {
        NODE_ENV: 'production',
        SHOPIFY_API_KEY,
        SHOPIFY_API_SECRET,
        HOST,
        SCOPES,
        PORT,
        SERVER_PORT,
        BACKEND_PORT,
        SHOP,
        WEBHOOKS,
        API_VERSION,

        POSTGRES_USER,
        POSTGRES_PWD,
        POSTGRES_HOST,
        POSTGRES_PORT,
        POSTGRES_DB,

        TICKET_URL,
        TICKET_AUTH,
        TICKET_GROUP,

        APP_MANAGEMENT_UID,
        APP_MANAGEMENT_BASE_URL,
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
}
