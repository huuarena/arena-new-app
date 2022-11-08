import ArticleMiddleware from './article.js'
import BlogMiddleware from './blog.js'
import CollectionMiddleware from './collection.js'
import CustomerMiddleware from './customer.js'
import CustomCollectionMiddleware from './custom_collection.js'
import MetafieldMiddleware from './metafield.js'
import PageMiddleware from './page.js'
import ProductMiddleware from './product.js'
import RedirectMiddleware from './redirect.js'
import SmartCollectionMiddleware from './smart_collection.js'

const getProduct = async ({ shop, accessToken, id }) => {
  try {
    /**
     * get product
     */
    let product = await ProductMiddleware.findById({
      shop,
      accessToken,
      id,
    })
    product = product.product
    console.log(`\t\t\t\t product ${product.id}`)

    /**
     * get variants
     */
    let variants = product.variants
    console.log(`\t\t\t\t total variants ${variants.length}`)

    delete product.variants

    /**
     * get images
     */
    let images = product.images
    console.log(`\t\t\t\t total images ${images.length}`)

    delete product.images
    delete product.image

    /**
     * get metafields
     */
    let metafields = await MetafieldMiddleware.getAll({
      shop,
      accessToken,
      resource: `products/${product.id}/`,
    })
    console.log(`\t\t\t\t total metafields ${metafields.length}`)

    /**
     * get variants metafields
     */
    let variantsMetafields = []
    for (let i = 0, leng = variants.length; i < leng; i++) {
      let _metafields = await MetafieldMiddleware.getAll({
        shop,
        accessToken,
        resource: `variants/${variants[i].id}/`,
      })

      variantsMetafields = variantsMetafields.concat(_metafields)
    }
    console.log(`\t\t\t\t total variants metafields ${variantsMetafields.length}`)

    /**
     * get images metafields
     */
    let imagesMetafields = []
    for (let i = 0, leng = images.length; i < leng; i++) {
      let _metafields = await MetafieldMiddleware.getAll({
        shop,
        accessToken,
        resource: `product_images/${images[i].id}/`,
      })

      imagesMetafields = imagesMetafields.concat(_metafields)
    }
    console.log(`\t\t\t\t total images metafields ${imagesMetafields.length}`)

    return {
      product,
      metafields,
      variants,
      variantsMetafields,
      images,
      imagesMetafields,
    }
  } catch (error) {
    console.log('getProduct error :>> ', error)
    throw error
  }
}

const getCustomCollection = async ({ shop, accessToken, id }) => {
  try {
    /**
     * get custom collection
     */
    let custom_collection = await CustomCollectionMiddleware.findById({
      shop,
      accessToken,
      id,
    })
    custom_collection = custom_collection.custom_collection
    console.log(`\t\t\t\t custom_collection ${custom_collection.id}`)

    /**
     * get custom collection image
     */
    let image = custom_collection.image
    console.log(`\t\t\t\t has image ${Boolean(image)}`)

    delete custom_collection.image

    /**
     * get products
     */
    let products = await CollectionMiddleware.getAllProducts({
      shop,
      accessToken,
      id: custom_collection.id,
    })
    products = products.map((item) => item.id)
    console.log(`\t\t\t\t total products ${products.length}`)

    /**
     * get metafields
     */
    let metafields = await MetafieldMiddleware.getAll({
      shop,
      accessToken,
      resource: `custom_collections/${custom_collection.id}/`,
    })
    console.log(`\t\t\t\t total metafields ${metafields.length}`)

    return {
      custom_collection,
      image,
      products,
      metafields,
    }
  } catch (error) {
    console.log('getCustomCollection error :>> ', error)
    throw error
  }
}

const getSmartCollection = async ({ shop, accessToken, id }) => {
  try {
    /**
     * get smart collection
     */
    let smart_collection = await SmartCollectionMiddleware.findById({
      shop,
      accessToken,
      id,
    })
    smart_collection = smart_collection.smart_collection
    console.log(`\t\t\t\t smart_collection ${smart_collection.id}`)

    /**
     * get smart collection image
     */
    let image = smart_collection.image
    console.log(`\t\t\t\t has image ${Boolean(image)}`)

    delete smart_collection.image

    /**
     * get smart collection rules
     */
    let rules = smart_collection.rules
    console.log(`\t\t\t\t total rules ${rules.length}`)

    delete smart_collection.rules

    /**
     * get metafields
     */
    let metafields = await MetafieldMiddleware.getAll({
      shop,
      accessToken,
      resource: `smart_collections/${smart_collection.id}/`,
    })
    console.log(`\t\t\t\t total metafields ${metafields.length}`)

    return {
      smart_collection,
      rules,
      image,
      metafields,
    }
  } catch (error) {
    console.log('getSmartCollection error :>> ', error)
    throw error
  }
}

const getPage = async ({ shop, accessToken, id }) => {
  try {
    /**
     * get page
     */
    let page = await PageMiddleware.findById({
      shop,
      accessToken,
      id,
    })
    page = page.page
    console.log(`\t\t\t\t page ${page.id}`)

    /**
     * get metafields
     */
    let metafields = await MetafieldMiddleware.getAll({
      shop,
      accessToken,
      resource: `pages/${id}/`,
    })
    console.log(`\t\t\t\t total metafields ${metafields.length}`)

    return {
      page,
      metafields,
    }
  } catch (error) {
    console.log('getPage error :>> ', error)
    throw error
  }
}

const getBlog = async ({ shop, accessToken, id }) => {
  try {
    /**
     * get blog
     */
    let blog = await BlogMiddleware.findById({
      shop,
      accessToken,
      id,
    })
    blog = blog.blog
    console.log(`\t\t\t\t blog ${blog.id}`)

    /**
     * get metafields
     */
    let metafields = await MetafieldMiddleware.getAll({
      shop,
      accessToken,
      resource: `blogs/${id}/`,
    })
    console.log(`\t\t\t\t total metafields ${metafields.length}`)

    /**
     * get articles
     */
    let articles = await ArticleMiddleware.getAll({
      shop,
      accessToken,
      blog_id: id,
    })
    console.log(`\t\t\t\t total articles ${articles.length}`)

    /**
     * get articles images
     */
    let articlesImages = articles
      .filter((item) => item.image)
      .map((item) => ({ ...item.image, owner_id: item.id }))
    console.log(`\t\t\t\t total articles images ${articlesImages.length}`)

    articles = articles.map((item) => {
      let obj = { ...item }
      delete obj.image
      return obj
    })

    /**
     * get articles metafields
     */
    let articlesMetafields = []
    for (let i = 0; i < articles.length; i++) {
      let _metafields = await MetafieldMiddleware.getAll({
        shop,
        accessToken,
        resource: `blogs/${id}/articles/${articles[i].id}/`,
      })

      articlesMetafields = articlesMetafields.concat(_metafields)
    }
    console.log(`\t\t\t\t total articles metafields ${articlesMetafields.length}`)

    return {
      blog,
      metafields,
      articles,
      articlesImages,
      articlesMetafields,
    }
  } catch (error) {
    console.log('getBlog error :>> ', error)
    throw error
  }
}

const getRedirect = async ({ shop, accessToken, id }) => {
  try {
    /**
     * get redirect
     */
    let redirect = await RedirectMiddleware.findById({
      shop,
      accessToken,
      id,
    })
    redirect = redirect.redirect
    console.log(`\t\t\t\t redirect ${redirect.id}`)

    return { redirect }
  } catch (error) {
    console.log('getRedirect error :>> ', error)
    throw error
  }
}

const getMetafield = async ({ shop, accessToken, id }) => {
  try {
    /**
     * get metafield
     */
    let metafield = await MetafieldMiddleware.findById({
      shop,
      accessToken,
      id,
    })
    metafield = metafield.metafield
    console.log(`\t\t\t\t metafield ${metafield.id}`)

    return { metafield }
  } catch (error) {
    console.log('getMetafield error :>> ', error)
    throw error
  }
}

const getCustomer = async ({ shop, accessToken, id }) => {
  try {
    /**
     * get customer
     */
    let customer = await CustomerMiddleware.findById({
      shop,
      accessToken,
      id,
    })
    customer = customer.customer
    console.log(`\t\t\t\t customer ${customer.id}`)

    /**
     * get addresses
     */
    let addresses = customer.addresses
    console.log(`\t\t\t\t total addresses ${addresses.length}`)

    delete customer.addresses
    delete customer.default_address

    /**
     * get metafields
     */
    let metafields = await MetafieldMiddleware.getAll({
      shop,
      accessToken,
      resource: `customers/${id}/`,
    })
    console.log(`\t\t\t\t total metafields ${metafields.length}`)

    return {
      customer,
      addresses,
      metafields,
    }
  } catch (error) {
    console.log('getCustomer error :>> ', error)
    throw error
  }
}

const getExportData = async ({ shop, accessToken, type, resources }) => {
  try {
    let dataList = []

    for (let i = 0, leng = resources.length; i < leng; i++) {
      console.log(`\t\t\t [${i + 1}/${leng}] run`)

      let data = {}

      switch (type) {
        case 'product':
          data = await getProduct({ shop, accessToken, id: resources[i] })
          break

        case 'custom_collection':
          data = await getCustomCollection({ shop, accessToken, id: resources[i] })
          break

        case 'smart_collection':
          data = await getSmartCollection({ shop, accessToken, id: resources[i] })
          break

        case 'page':
          data = await getPage({ shop, accessToken, id: resources[i] })
          break

        case 'blog':
          data = await getBlog({ shop, accessToken, id: resources[i] })
          break

        case 'redirect':
          data = await getRedirect({ shop, accessToken, id: resources[i] })
          break

        case 'metafield':
          data = await getMetafield({ shop, accessToken, id: resources[i] })
          break

        case 'customer':
          data = await getCustomer({ shop, accessToken, id: resources[i] })
          break

        case 'file':
          data = { file: resources[i] }
          break

        default:
          throw new Error('Invalid resource type')
      }

      dataList.push(data)

      console.log(`\t\t\t [${i + 1}/${leng}] completed`)
    }

    return dataList
  } catch (error) {
    console.log('getExportData error :>> ', error)
    throw error
  }
}

export default getExportData
