import Model from '../models/store_setting.js'
import ErrorCodes from '../constants/errorCodes.js'
import ShopifyShopMiddleware from '../middlewares/shopify_shop.js'

export default {
  count: async (where) => {
    try {
      return await Model.count(where)
    } catch (error) {
      throw { message: error.errors?.[0]?.message || error.message }
    }
  },

  find: async ({ page, limit, where }) => {
    try {
      let _page = parseInt(page) >= 1 ? parseInt(page) : 1
      let _limit = parseInt(limit) >= 1 ? parseInt(limit) : 20
      let _where = where || {}

      let filter = {
        where: _where,
        limit: _limit,
        offset: (_page - 1) * _limit,
        order: [['updatedAt', 'DESC']],
      }

      let count = await Model.count({ where: _where })
      let items = await Model.findAll(filter)

      return {
        items: items.map((item) => item.toJSON()),
        page: _page,
        limit: _limit,
        totalPages: Math.ceil(count / _limit),
        totalItems: count,
      }
    } catch (error) {
      throw { message: error.errors?.[0]?.message || error.message }
    }
  },

  findById: async (id) => {
    try {
      let entry = await Model.findOne({ where: { id } })
      if (!entry) {
        throw new Error(ErrorCodes.NOT_FOUND)
      }

      return entry.toJSON()
    } catch (error) {
      throw { message: error.errors?.[0]?.message || error.message }
    }
  },

  findOne: async (where) => {
    try {
      let entry = await Model.findOne({ where })
      if (!entry) {
        throw new Error(ErrorCodes.NOT_FOUND)
      }

      return entry.toJSON()
    } catch (error) {
      throw { message: error.errors?.[0]?.message || error.message }
    }
  },

  create: async (data) => {
    try {
      const created = await Model.create(data)

      return created.toJSON()
    } catch (error) {
      throw { message: error.errors?.[0]?.message || error.message }
    }
  },

  update: async (id, data) => {
    try {
      let updated = await Model.update(data, {
        where: { id },
        returning: true,
        plain: true,
      })

      return updated[1].toJSON()
    } catch (error) {
      throw { message: error.errors?.[0]?.message || error.message }
    }
  },

  delete: async (id) => {
    try {
      return await Model.destroy({ where: { id } })
    } catch (error) {
      throw { message: error.errors?.[0]?.message || error.message }
    }
  },

  init: async (session) => {
    try {
      let storeSetting = await Model.findOne({ where: { shop: session.shop } })
      if (!storeSetting) {
        /**
         * Get shopify shop
         */
        let shopifyShop = await ShopifyShopMiddleware.get({
          shop: session.shop,
          accessToken: session.accessToken,
        })
          .then((res) => res.shop)
          .catch((err) => {
            throw err
          })

        /**
         * Init new store setting
         */
        storeSetting = await Model.create({
          shop: session.shop,
          accessToken: session.accessToken,
          scope: session.scope,
          testStore: process.env.SHOP === session.shop,
          role: process.env.SHOP === session.shop ? 'ADMIN' : 'GUEST',
          name: shopifyShop.name,
          email: shopifyShop.email,
          phone: shopifyShop.phone,
          planName: shopifyShop.plan_name,
          shopOwner: shopifyShop.shop_owner,
        })
        storeSetting = storeSetting.toJSON()
      } else {
        /**
         * App already install
         */
        storeSetting = storeSetting.toJSON()

        /**
         * Update store if any
         */
        if (
          storeSetting.accessToken !== session.accessToken ||
          storeSetting.scope !== session.scope ||
          storeSetting.status !== 'RUNNING'
        ) {
          storeSetting = await Model.update(
            {
              accessToken: session.accessToken,
              scope: session.scope,
              status: 'RUNNING',
            },
            {
              where: { id: storeSetting.id },
              returning: true,
              plain: true,
            }
          )
          storeSetting = storeSetting[1].toJSON()
        }
      }

      return storeSetting
    } catch (error) {
      throw { message: error.errors?.[0]?.message || error.message }
    }
  },
}
