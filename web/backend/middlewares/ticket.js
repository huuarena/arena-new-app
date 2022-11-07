import axios from 'axios'

const create = async ({ shop, email, planName, subject, tag, description }) => {
  try {
    let res = await axios({
      url: process.env.TICKET_URL,
      method: 'POST',
      headers: {
        Authorization: process.env.TICKET_AUTH,
        'Content-type': 'application/json; charset=utf-8',
      },
      data: {
        email,
        subject,
        type: 'Question',
        description,
        status: 2,
        group_id: Number(process.env.TICKET_GROUP),
        tags: ['acopy', 'app', planName, tag],
        custom_fields: {
          cf_your_store_name: shop,
          cf_plan: planName,
          cf_shop_owner: email,
        },
      },
    })

    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error: { message: error.message } }
  }
}

const TicketMiddleware = { create }

export default TicketMiddleware
