import Controller from '../controllers/app_management.js'

export default function appManagementRoute(app) {
  app.get('/api/app-management-privacy', Controller.getPrivacy)
  app.get('/api/app-management-faqs', Controller.getFaqs)
}
