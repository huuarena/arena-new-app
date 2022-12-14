import apiCaller from '../helpers/apiCaller.js'

const create = async ({ shop, accessToken, topic }) => {
  try {
    apiCaller({
      shop,
      accessToken,
      endpoint: `webhooks.json`,
      method: 'POST',
      data: {
        webhook: {
          topic,
          address: process.env.HOST + '/api/webhooks',
          format: 'json',
          fields: ['id'],
        },
      },
    })
      .then((res) => {
        // console.log(`${shop} webhook ${topic} registed`)
      })
      .catch((err) => {
        // console.log(`${shop} register webhook ${topic} failed:`, err.message)
      })
  } catch (error) {
    throw error
  }
}

const WebhookMiddleware = {
  create,
}

export default WebhookMiddleware
