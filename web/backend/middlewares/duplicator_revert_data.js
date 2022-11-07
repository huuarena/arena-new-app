import {
  ArticleFields,
  ArticleImageFields,
  BlogFields,
  CollectionImageFields,
  CustomCollectionFields,
  CustomerAddressFields,
  CustomerFields,
  FileFields,
  MetafieldFields,
  PageFields,
  ProductFields,
  ProductImageFields,
  RedirectFields,
  SmartCollectionFields,
  SmartCollectionRuleFields,
  VariantFields,
} from './duplicator_constants.js'

const groupData = (data) => {
  try {
    let resources = []

    data.forEach((row) => {
      let index = resources.map((item) => item['id']).indexOf(row['id'])
      if (index >= 0) {
        // already exist
        resources[index].rows.push(row)
      } else {
        // new item
        resources.push({ ['id']: row['id'], rows: [row] })
      }
    })

    return resources
  } catch (error) {
    throw error
  }
}

const revertProduct = (shop, resources) => {
  try {
    for (let ii = 0; ii < resources.length; ii++) {
      const { id, rows } = resources[ii]

      /**
       * images metafields
       */
      let imagesMetafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['image_metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      /**
       * variants metafields
       */
      let variantsMetafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['variant_metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      /**
       * metafields
       */
      let metafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      /**
       * images
       */
      let images = rows
        .map((row) => {
          let obj = {}
          ProductImageFields.forEach((key) => {
            switch (key) {
              case 'variant_ids':
                obj[key] = row['image_' + key] ? JSON.parse(row['image_' + key]) : []
                break

              default:
                obj[key] = row['image_' + key]
                break
            }
          })
          return obj
        })
        .filter((item) => item.src)
        .map((item) => {
          let obj = { ...item }

          obj.metafields = imagesMetafields.filter((_item) => _item.owner_id === item.id)
          obj.metafields.push({
            key: 'origin',
            value: JSON.stringify({ shop, id: item.id }),
            type: 'json',
            namespace: 'arena_duplicator',
          })

          return obj
        })

      /**
       * variants
       */
      let variants = rows
        .map((row) => {
          let obj = {}
          VariantFields.forEach((key) => (obj[key] = row['variant_' + key]))
          return obj
        })
        .filter((item) => item.title)
        .map((item) => {
          let obj = { ...item }

          obj.metafields = variantsMetafields.filter((_item) => _item.owner_id === item.id)
          obj.metafields.push({
            key: 'origin',
            value: JSON.stringify({ shop, id: item.id }),
            type: 'json',
            namespace: 'arena_duplicator',
          })

          return obj
        })

      /**
       * product
       */
      let product = {}
      ProductFields.forEach((key) => {
        switch (key) {
          case 'options':
            product[key] = rows[0][key] ? JSON.parse(rows[0][key]) : ''
            break

          default:
            product[key] = rows[0][key]
            break
        }
      })

      product.metafields = metafields
      product.metafields.push({
        key: 'origin',
        value: JSON.stringify({ shop, id }),
        type: 'json',
        namespace: 'arena_duplicator',
      })

      resources[ii] = {
        product,
        variants,
        images,
      }
    }

    return resources
  } catch (error) {
    throw error
  }
}

const revertCustomCollection = (shop, resources) => {
  try {
    for (let ii = 0; ii < resources.length; ii++) {
      const { id, rows } = resources[ii]

      /**
       * custom collection
       */
      let custom_collection = {}
      CustomCollectionFields.forEach((key) => (custom_collection[key] = rows[0][key]))

      /**
       * image
       */
      let image = {}
      CollectionImageFields.forEach((key) => (image[key] = rows[0]['image_' + key]))

      if (image.src) {
        custom_collection.image = image
      }

      /**
       * products
       */
      let products = rows[0]['product_ids'] ? JSON.parse(rows[0]['product_ids']) : []

      if (products.length) {
        custom_collection.collects = products
      }

      /**
       * metafields
       */
      let metafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      custom_collection.metafields = metafields
      custom_collection.metafields.push({
        key: 'origin',
        value: JSON.stringify({ shop, id }),
        type: 'json',
        namespace: 'arena_duplicator',
      })

      resources[ii] = { custom_collection }
    }

    return resources
  } catch (error) {
    throw error
  }
}

const revertSmartCollection = (shop, resources) => {
  try {
    for (let ii = 0; ii < resources.length; ii++) {
      const { id, rows } = resources[ii]

      /**
       * smart collection
       */
      let smart_collection = {}
      SmartCollectionFields.forEach((key) => {
        switch (key) {
          case 'disjunctive':
            smart_collection[key] = Boolean(rows[0][key] === true || rows[0][key] === 'true')
            break

          default:
            smart_collection[key] = rows[0][key]
            break
        }
      })

      /**
       * image
       */
      let image = {}
      CollectionImageFields.forEach((key) => (image[key] = rows[0]['image_' + key]))

      if (image.src) {
        smart_collection.image = image
      }

      /**
       * rules
       */
      let rules = rows
        .map((row) => {
          let obj = {}
          SmartCollectionRuleFields.forEach((key) => (obj[key] = row['rule_' + key]))
          return obj
        })
        .filter((item) => item.column)

      smart_collection.rules = rules

      /**
       * metafields
       */
      let metafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      smart_collection.metafields = metafields
      metafields.push({
        key: 'origin',
        value: JSON.stringify({ shop, id }),
        type: 'json',
        namespace: 'arena_duplicator',
      })

      resources[ii] = { smart_collection }
    }

    return resources
  } catch (error) {
    throw error
  }
}

const revertPage = (shop, resources) => {
  try {
    for (let ii = 0; ii < resources.length; ii++) {
      const { id, rows } = resources[ii]

      /**
       * page
       */
      let page = {}
      PageFields.forEach((key) => (page[key] = rows[0][key]))

      /**
       * metafields
       */
      let metafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      page.metafields = metafields
      page.metafields.push({
        key: 'origin',
        value: JSON.stringify({ shop, id }),
        type: 'json',
        namespace: 'arena_duplicator',
      })

      resources[ii] = { page }
    }

    return resources
  } catch (error) {
    throw error
  }
}

const revertBlog = (shop, resources) => {
  try {
    for (let ii = 0; ii < resources.length; ii++) {
      const { id, rows } = resources[ii]

      /**
       * articles metafields
       */
      let articlesMetafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['article_metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      /**
       * articles images
       */
      let articlesImages = rows
        .map((row) => {
          let obj = {}
          ArticleImageFields.forEach((key) => (obj[key] = row['article_image_' + key]))
          return obj
        })
        .filter((item) => item.src)

      /**
       * articles
       */
      let articles = rows
        .map((row) => {
          let obj = {}
          ArticleFields.forEach((key) => (obj[key] = row['article_' + key]))

          obj.image = articlesImages.find((item) => item['owner_id'] === obj.id)

          obj.metafields = articlesMetafields.filter((item) => item['owner_id'] === obj.id)
          obj.metafields.push({
            key: 'origin',
            value: JSON.stringify({ shop, id: obj.id }),
            type: 'json',
            namespace: 'arena_duplicator',
          })

          return obj
        })
        .filter((item) => item.id)

      /**
       * metafields
       */
      let metafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      /**
       * blog
       */
      let blog = {}
      BlogFields.forEach((key) => (blog[key] = rows[0][key]))

      blog.metafields = metafields
      blog.metafields.push({
        key: 'origin',
        value: JSON.stringify({ shop, id }),
        type: 'json',
        namespace: 'arena_duplicator',
      })

      resources[ii] = { blog, articles }
    }

    return resources
  } catch (error) {
    throw error
  }
}

const revertFile = (shop, resources) => {
  try {
    for (let ii = 0; ii < resources.length; ii++) {
      const rows = resources[ii].rows

      /**
       * file
       */
      let file = {}
      FileFields.forEach((key) => {
        switch (key) {
          case 'id':
            break

          case 'url':
            file['originalSource'] = rows[0][key]
            break

          default:
            file[key] = rows[0][key]
            break
        }
      })

      resources[ii] = { file }
    }

    return resources
  } catch (error) {
    throw error
  }
}

const revertRedirect = (shop, resources) => {
  try {
    for (let ii = 0; ii < resources.length; ii++) {
      const { id, rows } = resources[ii]

      /**
       * redirect
       */
      let redirect = {}
      RedirectFields.forEach((key) => (redirect[key] = rows[0][key]))

      resources[ii] = { redirect }
    }

    return resources
  } catch (error) {
    throw error
  }
}

const revertMetafield = (shop, resources) => {
  try {
    for (let ii = 0; ii < resources.length; ii++) {
      const { id, rows } = resources[ii]

      /**
       * metafield
       */
      let metafield = {}
      MetafieldFields.filter((item) => !['owner_id', 'owner_resource'].includes(item)).forEach(
        (key) => (metafield[key] = rows[0][key])
      )

      resources[ii] = { metafield }
    }

    return resources
  } catch (error) {
    throw error
  }
}

const revertCustomer = (shop, resources) => {
  try {
    for (let ii = 0; ii < resources.length; ii++) {
      const { id, rows } = resources[ii]

      /**
       * customer
       */
      let customer = {}
      CustomerFields.forEach((key) => (customer[key] = rows[0][key]))

      /**
       * addresses
       */
      let addresses = rows
        .map((row) => {
          let obj = {}
          CustomerAddressFields.forEach((key) => (obj[key] = row['address_' + key]))
          return obj
        })
        .filter((item) => item.id)

      /**
       * metafields
       */
      let metafields = rows
        .map((row) => {
          let obj = {}
          MetafieldFields.forEach((key) => (obj[key] = row['metafield_' + key]))
          return obj
        })
        .filter((item) => item.id)

      customer.metafields = metafields
      customer.metafields.push({
        key: 'origin',
        value: JSON.stringify({ shop, id }),
        type: 'json',
        namespace: 'arena_duplicator',
      })

      resources[ii] = { customer, addresses, metafields }
    }

    return resources
  } catch (error) {
    throw error
  }
}

const revertData = (type, shop, data) => {
  try {
    let resources = groupData(data)

    switch (type) {
      case 'product':
        return revertProduct(shop, resources)

      case 'custom_collection':
        return revertCustomCollection(shop, resources)

      case 'smart_collection':
        return revertSmartCollection(shop, resources)

      case 'page':
        return revertPage(shop, resources)

      case 'blog':
        return revertBlog(shop, resources)

      case 'redirect':
        return revertRedirect(shop, resources)

      case 'metafield':
        return revertMetafield(shop, resources)

      case 'customer':
        return revertCustomer(shop, resources)

      case 'file':
        return revertFile(shop, resources)

      default:
        throw new Error('Invalid resource type')
    }
  } catch (error) {
    console.log('revertData error :>> ', error)
    throw error
  }
}

export default revertData
