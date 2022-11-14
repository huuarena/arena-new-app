import apiCaller from '../helpers/apiCaller'

const TicketApi = {
  create: async (data) => {
    return await apiCaller(`/api/ticket`, 'POST', data)
  },
}

export default TicketApi
