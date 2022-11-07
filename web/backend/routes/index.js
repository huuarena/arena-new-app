import Controller from '../../controllers/admin_management.js'

export default function adminManagementRoute(app) {
  app.get('/admin-management/store-settings', Controller.getStoreSettings)
  app.put('/admin-management/store-settings/:id', Controller.updateStoreSetting)
}
