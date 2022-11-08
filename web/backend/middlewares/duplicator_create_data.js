import ArticleMiddleware from './article.js'
import BlogMiddleware from './blog.js'
import CustomerMiddleware from './customer.js'
import CustomerAddressMiddleware from './customer_address.js'
import CustomCollectionMiddleware from './custom_collection.js'
import MetafieldMiddleware from './metafield.js'
import PageMiddleware from './page.js'
import ProductMiddleware from './product.js'
import ProductImageMiddleware from './product_image.js'
import RedirectMiddleware from './redirect.js'
import SmartCollectionMiddleware from './smart_collection.js'

const createProduct = async ({ shop, accessToken, data }) => {
  const { product, variants, images } = data

  try {
    /**
     * create product
     */
    let productCreated = { ...product }
    productCreated.variants = variants.map((item) => {
      let obj = { ...item }
      delete obj.id
      delete obj.image_id
      delete obj.inventory_item_id
      delete obj.product_id
      delete obj.metafields
      return obj
    })
    delete productCreated.id
    delete productCreated.metafields

    productCreated = await ProductMiddleware.create({
      shop,
      accessToken,
      data: { product: productCreated },
    })
      .then((res) => {
        console.log(`\t\t\t product created ${res.product.id}`)
        return res.product
      })
      .catch((err) => {
        console.log(`\t\t\t create product failed: ${err.message}`)
        throw err
      })

    /**
     * create metafields
     */
    for (let i = 0, leng = product.metafields.length; i < leng; i++) {
      let metafield = { ...product.metafields[i] }
      delete metafield.id
      delete metafield.owner_id
      delete metafield.owner_resource

      await MetafieldMiddleware.create({
        shop,
        accessToken,
        resource: `products/${productCreated.id}/`,
        data: { metafield },
      })
        .then((res) => {
          console.log(`\t\t\t metafield created ${res.metafield.id}`)
        })
        .catch((err) => {
          console.log(`\t\t\t create metafield failed: ${err.message}`)
        })
    }

    /**
     * create variants metafields
     */
    for (let i = 0, leng = variants.length; i < leng; i++) {
      let originVariant = variants[i]
      let newVariant = productCreated.variants.find(
        (item) =>
          (item.option1 ? item.option1 === originVariant.option1 : true) &&
          (item.option2 ? item.option2 === originVariant.option2 : true) &&
          (item.option3 ? item.option3 === originVariant.option3 : true)
      )
      if (newVariant) {
        for (let j = 0, jleng = originVariant.metafields.length; j < jleng; j++) {
          let metafield = { ...originVariant.metafields[j] }
          delete metafield.id
          delete metafield.owner_id
          delete metafield.owner_resource

          await MetafieldMiddleware.create({
            shop,
            accessToken,
            resource: `variants/${newVariant.id}/`,
            data: { metafield },
          })
            .then((res) => {
              console.log(`\t\t\t variant metafield created ${res.metafield.id}`)
            })
            .catch((err) => {
              console.log(`\t\t\t create variant metafield failed: ${err.message}`)
            })
        }
      }
    }

    /**
     * create images
     */
    for (let i = 0, leng = images.length; i < leng; i++) {
      let image = { ...images[i] }
      image.variant_ids = image.variant_ids.map((item) => {
        let originVariant = variants.find((_item) => _item.id == item)
        let newVariant = productCreated.variants.find(
          (_item) =>
            (_item.option1 ? _item.option1 === originVariant.option1 : true) &&
            (_item.option2 ? _item.option2 === originVariant.option2 : true) &&
            (_item.option3 ? _item.option3 === originVariant.option3 : true)
        )
        return newVariant.id
      })
      delete image.id
      delete image.metafields

      await ProductImageMiddleware.create({
        shop,
        accessToken,
        product_id: productCreated.id,
        data: { image },
      })
        .then(async (res) => {
          console.log(`\t\t\t image created ${res.image.id}`)

          for (let j = 0, jleng = images[i].metafields.length; j < jleng; j++) {
            let metafield = { ...images[i].metafields[j] }
            delete metafield.id
            delete metafield.owner_id
            delete metafield.owner_resource

            await MetafieldMiddleware.create({
              shop,
              accessToken,
              resource: `product_images/${res.image.id}/`,
              data: { metafield },
            })
              .then((res) => {
                console.log(`\t\t\t\t image metafield created ${res.metafield.id}`)
              })
              .catch((err) => {
                console.log(`\t\t\t\t create variant metafield failed: ${err.message}`)
              })
          }
        })
        .catch((err) => {
          console.log(`\t\t\t create image failed: ${err.message}`)
        })
    }

    return { success: true, id: productCreated.id, handle: productCreated.handle }
  } catch (error) {
    return { success: false, id: product.id, handle: product.handle, message: error.message }
  }
}

const createCustomCollection = async ({ shop, accessToken, data }) => {
  const { custom_collection } = data

  try {
    /**
     * create collection
     */
    let collectionCreated = { ...custom_collection }

    delete collectionCreated.id
    delete collectionCreated.metafields

    collectionCreated = await CustomCollectionMiddleware.create({
      shop,
      accessToken,
      data: { custom_collection: collectionCreated },
    })
      .then((res) => {
        console.log(`\t\t\t custom collection created ${res.custom_collection.id}`)
        return res.custom_collection
      })
      .catch((err) => {
        console.log(`\t\t\t create custom collection failed: ${err.message}`)
        throw err
      })

    /**
     * create metafields
     */
    for (let i = 0, leng = custom_collection.metafields.length; i < leng; i++) {
      let metafield = { ...custom_collection.metafields[i] }
      delete metafield.id
      delete metafield.owner_id
      delete metafield.owner_resource

      await MetafieldMiddleware.create({
        shop,
        accessToken,
        resource: `custom_collections/${collectionCreated.id}/`,
        data: { metafield },
      })
        .then((res) => {
          console.log(`\t\t\t metafield created ${res.metafield.id}`)
        })
        .catch((err) => {
          console.log(`\t\t\t create metafield failed: ${err.message}`)
        })
    }

    return { success: true, id: collectionCreated.id, handle: collectionCreated.handle }
  } catch (error) {
    return {
      success: false,
      id: custom_collection.id,
      handle: custom_collection.handle,
      message: error.message,
    }
  }
}

const createSmartCollection = async ({ shop, accessToken, data }) => {
  const { smart_collection } = data

  try {
    /**
     * create smart collection
     */
    let collectionCreated = { ...smart_collection }

    delete collectionCreated.id
    delete collectionCreated.metafields

    collectionCreated = await SmartCollectionMiddleware.create({
      shop,
      accessToken,
      data: { smart_collection: collectionCreated },
    })
      .then((res) => {
        console.log(`\t\t\t smart collection created ${res.smart_collection.id}`)
        return res.smart_collection
      })
      .catch((err) => {
        console.log(`\t\t\t create smart collection failed: ${err.message}`)
        throw err
      })

    /**
     * create metafields
     */
    for (let i = 0, leng = smart_collection.metafields.length; i < leng; i++) {
      let metafield = { ...smart_collection.metafields[i] }
      delete metafield.id
      delete metafield.owner_id
      delete metafield.owner_resource

      await MetafieldMiddleware.create({
        shop,
        accessToken,
        resource: `smart_collections/${collectionCreated.id}/`,
        data: { metafield },
      })
        .then((res) => {
          console.log(`\t\t\t metafield created ${res.metafield.id}`)
        })
        .catch((err) => {
          console.log(`\t\t\t create metafield failed: ${err.message}`)
        })
    }

    return { success: true, id: collectionCreated.id, handle: collectionCreated.handle }
  } catch (error) {
    return {
      success: false,
      id: smart_collection.id,
      handle: smart_collection.handle,
      message: error.message,
    }
  }
}

const createPage = async ({ shop, accessToken, data }) => {
  const { page } = data

  try {
    /**
     * create page
     */
    let pageCreated = { ...page }

    delete pageCreated.id
    delete pageCreated.metafields

    pageCreated = await PageMiddleware.create({
      shop,
      accessToken,
      data: { page: pageCreated },
    })
      .then((res) => {
        console.log(`\t\t\t page created ${res.page.id}`)
        return res.page
      })
      .catch((err) => {
        console.log(`\t\t\t create page failed: ${err.message}`)
        throw err
      })

    /**
     * create metafields
     */
    for (let i = 0, leng = page.metafields.length; i < leng; i++) {
      let metafield = { ...page.metafields[i] }
      delete metafield.id
      delete metafield.owner_id
      delete metafield.owner_resource

      await MetafieldMiddleware.create({
        shop,
        accessToken,
        resource: `pages/${pageCreated.id}/`,
        data: { metafield },
      })
        .then((res) => {
          console.log(`\t\t\t metafield created ${res.metafield.id}`)
        })
        .catch((err) => {
          console.log(`\t\t\t create metafield failed: ${err.message}`)
        })
    }

    return { success: true, id: pageCreated.id, handle: pageCreated.handle }
  } catch (error) {
    return { success: false, id: page.id, handle: page.handle, message: error.message }
  }
}

const createBlog = async ({ shop, accessToken, data }) => {
  const { blog, articles } = data

  try {
    /**
     * create blog
     */
    let blogCreated = { ...blog }

    delete blogCreated.id
    delete blogCreated.metafields

    blogCreated = await BlogMiddleware.create({
      shop,
      accessToken,
      data: { blog: blogCreated },
    })
      .then((res) => {
        console.log(`\t\t\t blog created ${res.blog.id}`)
        return res.blog
      })
      .catch((err) => {
        console.log(`\t\t\t create blog failed: ${err.message}`)
        throw err
      })

    /**
     * create metafields
     */
    for (let i = 0; i < blog.metafields.length; i++) {
      let metafield = { ...blog.metafields[i] }

      delete metafield.id
      delete metafield.owner_id
      delete metafield.owner_resource

      metafield = await MetafieldMiddleware.create({
        shop,
        accessToken,
        resource: `blogs/${blogCreated.id}/`,
        data: { metafield },
      })
        .then((res) => {
          console.log(`\t\t\t metafield created ${res.metafield.id}`)
        })
        .catch((err) => {
          console.log(`\t\t\t create metafield failed: ${err.message}`)
        })
    }

    /**
     * create articles
     */
    for (let i = 0; i < articles.length; i++) {
      let article = { ...articles[i], blog_id: blogCreated.id }

      delete article.id
      delete article.metafields

      if (article.image) {
        delete article.image.owner_id
      } else {
        delete article.image
      }

      article = await ArticleMiddleware.create({
        shop,
        accessToken,
        blog_id: blogCreated.id,
        data: { article },
      })
        .then(async (res) => {
          console.log(`\t\t\t article created ${res.article.id}`)

          /**
           * create article metafields
           */
          for (let j = 0; j < articles[i].metafields.length; j++) {
            let metafield = { ...articles[i].metafields[j] }

            delete metafield.id
            delete metafield.owner_id
            delete metafield.owner_resource

            metafield = await MetafieldMiddleware.create({
              shop,
              accessToken,
              resource: `blogs/${blogCreated.id}/articles/${res.article.id}/`,
              data: { metafield },
            })
              .then((res) => {
                console.log(`\t\t\t\t metafield created ${res.metafield.id}`)
              })
              .catch((err) => {
                console.log(`\t\t\t\t create metafield failed: ${err.message}`)
              })
          }
        })
        .catch((err) => {
          console.log(`\t\t\t create article failed: ${err.message}`)
        })
    }

    return { success: true, id: blogCreated.id, handle: blogCreated.handle }
  } catch (error) {
    return { success: false, id: blog.id, handle: blog.handle, message: error.message }
  }
}

const createRedirect = async ({ shop, accessToken, data }) => {
  const { redirect } = data

  try {
    /**
     * create redirect
     */
    let redirectCreated = { ...redirect }

    delete redirectCreated.id

    redirectCreated = await RedirectMiddleware.create({
      shop,
      accessToken,
      data: { redirect: redirectCreated },
    })
      .then((res) => {
        console.log(`\t\t\t redirect created ${res.redirect.id}`)
        return res.redirect
      })
      .catch((err) => {
        console.log(`\t\t\t create redirect failed: ${err.message}`)
        throw err
      })

    return { success: true, id: redirectCreated.id }
  } catch (error) {
    return { success: false, id: redirect.id, message: error.message }
  }
}

const createMetafield = async ({ shop, accessToken, data }) => {
  const { metafield } = data

  try {
    /**
     * create metafield
     */
    let metafieldCreated = { ...metafield }

    delete metafieldCreated.id

    metafieldCreated = await MetafieldMiddleware.create({
      shop,
      accessToken,
      data: { metafield: metafieldCreated },
    })
      .then((res) => {
        console.log(`\t\t\t metafield created ${res.metafield.id}`)
        return res.metafield
      })
      .catch((err) => {
        console.log(`\t\t\t create metafield failed: ${err.message}`)
        throw err
      })

    return { success: true, id: metafieldCreated.id }
  } catch (error) {
    return { success: false, id: metafield.id, message: error.message }
  }
}

const createCustomer = async ({ shop, accessToken, data }) => {
  const { customer, addresses, metafields } = data

  try {
    /**
     * create customer
     */
    let customerCreated = { ...customer }

    delete customerCreated.id
    delete customerCreated.metafields

    customerCreated = await CustomerMiddleware.create({
      shop,
      accessToken,
      data: { customer: customerCreated },
    })
      .then((res) => {
        console.log(`\t\t\t customer created ${res.customer.id}`)
        return res.customer
      })
      .catch((err) => {
        console.log(`\t\t\t create customer failed: ${err.message}`)
        throw err
      })

    /**
     * create addresses
     */
    for (let i = 0, leng = addresses.length; i < leng; i++) {
      let customer_address = { ...addresses[i] }
      delete customer_address.id

      await CustomerAddressMiddleware.create({
        shop,
        accessToken,
        customerId: customerCreated.id,
        data: { customer_address },
      })
        .then((res) => {
          console.log(`\t\t\t address created ${res.customer_address.id}`)
        })
        .catch((err) => {
          console.log(`\t\t\t create address failed: ${err.message}`)
        })
    }

    /**
     * create metafields
     */
    for (let i = 0, leng = metafields.length; i < leng; i++) {
      let metafield = { ...metafields[i] }
      delete metafield.id
      delete metafield.owner_id
      delete metafield.owner_resource

      await MetafieldMiddleware.create({
        shop,
        accessToken,
        resource: `customers/${customerCreated.id}/`,
        data: { metafield },
      })
        .then((res) => {
          console.log(`\t\t\t metafield created ${res.metafield.id}`)
        })
        .catch((err) => {
          console.log(`\t\t\t create metafield failed: ${err.message}`)
        })
    }

    return { success: true, id: customerCreated.id }
  } catch (error) {
    return { success: false, id: customer.id, message: error.message }
  }
}

const createData = async ({ shop, accessToken, type, resources, productsWithOriginMetafields }) => {
  try {
    let dataList = []

    for (let i = 0, leng = resources.length; i < leng; i++) {
      console.log(`\t\t [${i + 1}/${leng}] run`)
      let data = {}

      switch (type) {
        case 'product':
          data = await createProduct({ shop, accessToken, data: resources[i] })
          break

        case 'custom_collection':
          let custom_collection = resources[i].custom_collection
          if (custom_collection.collects) {
            custom_collection.collects = custom_collection.collects
              .map((item) => productsWithOriginMetafields.find((_item) => _item.origin.id == item))
              .filter((item) => item)
              .map((item) => ({ product_id: item.id }))
          }

          data = await createCustomCollection({
            shop,
            accessToken,
            data: { ...resources[i], custom_collection },
          })
          break

        case 'smart_collection':
          data = await createSmartCollection({ shop, accessToken, data: resources[i] })
          break

        case 'page':
          data = await createPage({ shop, accessToken, data: resources[i] })
          break

        case 'blog':
          data = await createBlog({ shop, accessToken, data: resources[i] })
          break

        case 'redirect':
          data = await createRedirect({ shop, accessToken, data: resources[i] })
          break

        case 'metafield':
          data = await createMetafield({ shop, accessToken, data: resources[i] })
          break

        case 'customer':
          data = await createCustomer({ shop, accessToken, data: resources[i] })
          break

        default:
          throw new Error('Invalid type')
          break
      }

      dataList.push(data)
      console.log(`\t\t [${i + 1}/${leng}] completed`)
    }

    return dataList
  } catch (error) {
    console.log('createData error :>> ', error)
    throw error
  }
}

export default createData
