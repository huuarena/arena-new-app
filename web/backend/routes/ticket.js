import Controller from '../controllers/ticket.js'

export default function ticketRoute(app) {
  app.post('/api/ticket', Controller.create)
}
