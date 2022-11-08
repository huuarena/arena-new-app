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

const getFieldValue = (value) => {
  try {
    if (value === null || value === undefined) {
      return ''
    }

    return String(value)
  } catch (error) {
    return ''
  }
}

const convertProduct = (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { product, metafields, variants, variantsMetafields, images, imagesMetafields } =
        dataList[ii]

      const length = Math.max(
        metafields.length,
        variants.length,
        variantsMetafields.length,
        images.length,
        imagesMetafields.length,
        1
      )

      for (let i = 0; i < length; i++) {
        let row = {}

        ProductFields.forEach((key) => {
          switch (key) {
            case 'id':
              row[key] = getFieldValue(product[key])
              break

            case 'options':
              row[key] =
                i === 0
                  ? JSON.stringify(
                      product.options.map((item) => ({
                        position: item.position,
                        name: item.name,
                        values: item.values,
                      }))
                    )
                  : ''
              break

            default:
              row[key] = i === 0 ? getFieldValue(product[key]) : ''
              break
          }
        })
        MetafieldFields.forEach(
          (key) => (row['metafield_' + key] = getFieldValue(metafields[i]?.[key]))
        )

        VariantFields.forEach((key) => (row['variant_' + key] = getFieldValue(variants[i]?.[key])))
        MetafieldFields.forEach(
          (key) => (row['variant_metafield_' + key] = getFieldValue(variantsMetafields[i]?.[key]))
        )

        ProductImageFields.forEach((key) => {
          switch (key) {
            case 'variant_ids':
              row['image_' + key] = images[i]?.[key] ? JSON.stringify(images[i]?.[key]) : '[]'
              break

            default:
              row['image_' + key] = getFieldValue(images[i]?.[key])
              break
          }
        })
        MetafieldFields.forEach(
          (key) => (row['image_metafield_' + key] = getFieldValue(imagesMetafields[i]?.[key]))
        )

        rows.push(row)
      }
    }

    return rows
  } catch (error) {
    throw error
  }
}

const convertCustomCollection = (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { custom_collection, image, products, metafields } = dataList[ii]

      const length = Math.max(metafields.length, 1)

      for (let i = 0; i < length; i++) {
        let row = {}

        CustomCollectionFields.forEach((key) => {
          switch (key) {
            case 'id':
              row[key] = getFieldValue(custom_collection[key])
              break

            default:
              row[key] = i === 0 ? getFieldValue(custom_collection[key]) : ''
              break
          }
        })

        CollectionImageFields.forEach(
          (key) => (row['image_' + key] = i === 0 ? getFieldValue(image?.[key]) : '')
        )

        row['product_ids'] = JSON.stringify(products)

        MetafieldFields.forEach(
          (key) => (row['metafield_' + key] = getFieldValue(metafields[i]?.[key]))
        )

        rows.push(row)
      }
    }

    return rows
  } catch (error) {
    throw error
  }
}

const convertSmartCollection = (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { smart_collection, image, rules, metafields } = dataList[ii]

      const length = Math.max(rules.length, metafields.length, 1)

      for (let i = 0; i < length; i++) {
        let row = {}

        SmartCollectionFields.forEach((key) => {
          switch (key) {
            case 'id':
              row[key] = getFieldValue(smart_collection[key])
              break

            default:
              row[key] = i === 0 ? getFieldValue(smart_collection[key]) : ''
              break
          }
        })

        CollectionImageFields.forEach(
          (key) => (row['image_' + key] = i === 0 ? getFieldValue(image?.[key]) : '')
        )

        SmartCollectionRuleFields.forEach(
          (key) => (row['rule_' + key] = getFieldValue(rules[i]?.[key]))
        )

        MetafieldFields.forEach(
          (key) => (row['metafield_' + key] = getFieldValue(metafields[i]?.[key]))
        )

        rows.push(row)
      }
    }

    return rows
  } catch (error) {
    throw error
  }
}

const convertPage = (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { page, metafields } = dataList[ii]

      const length = Math.max(metafields.length || 1)

      for (let i = 0; i < length; i++) {
        let row = {}

        PageFields.forEach((key) => {
          switch (key) {
            case 'id':
              row[key] = getFieldValue(page[key])
              break

            default:
              row[key] = i === 0 ? getFieldValue(page[key]) : ''
              break
          }
        })
        MetafieldFields.forEach(
          (key) => (row['metafield_' + key] = getFieldValue(metafields[i]?.[key]))
        )

        rows.push(row)
      }
    }

    return rows
  } catch (error) {
    throw error
  }
}

const convertBlog = (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { blog, metafields, articles, articlesImages, articlesMetafields } = dataList[ii]

      const length = Math.max(
        metafields.length ||
          articles.length ||
          articlesImages.length ||
          articlesMetafields.length ||
          1
      )

      for (let i = 0; i < length; i++) {
        let row = {}

        BlogFields.forEach((key) => {
          switch (key) {
            case 'id':
              row[key] = getFieldValue(blog[key])
              break

            default:
              row[key] = i === 0 ? getFieldValue(blog[key]) : ''
              break
          }
        })
        MetafieldFields.forEach(
          (key) => (row['metafield_' + key] = getFieldValue(metafields[i]?.[key]))
        )

        ArticleFields.forEach((key) => (row['article_' + key] = getFieldValue(articles[i]?.[key])))
        ArticleImageFields.forEach(
          (key) => (row['article_image_' + key] = getFieldValue(articlesImages[i]?.[key]))
        )
        MetafieldFields.forEach(
          (key) => (row['article_metafield_' + key] = getFieldValue(articlesMetafields[i]?.[key]))
        )

        rows.push(row)
      }
    }

    return rows
  } catch (error) {
    throw error
  }
}

const convertFile = (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { file } = dataList[ii]

      const length = 1

      for (let i = 0; i < length; i++) {
        let row = {}

        FileFields.forEach((key) => {
          switch (key) {
            case 'id':
              row[key] = getFieldValue(file[key])
              break

            case 'url':
              row[key] = file.image?.originalSrc || file[key] || ''
              break

            case 'contentType':
              row[key] = file.id.includes('GenericFile') ? 'FILE' : 'IMAGE'
              break

            default:
              row[key] = i === 0 ? getFieldValue(file[key]) : ''
              break
          }
        })

        rows.push(row)
      }
    }

    return rows
  } catch (error) {
    throw error
  }
}

const convertRedirect = (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { redirect } = dataList[ii]

      const length = 1

      for (let i = 0; i < length; i++) {
        let row = {}

        RedirectFields.forEach((key) => {
          switch (key) {
            case 'id':
              row[key] = getFieldValue(redirect[key])
              break

            default:
              row[key] = i === 0 ? getFieldValue(redirect[key]) : ''
              break
          }
        })

        rows.push(row)
      }
    }

    return rows
  } catch (error) {
    throw error
  }
}

const convertMetafield = (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { metafield } = dataList[ii]

      const length = 1

      for (let i = 0; i < length; i++) {
        let row = {}

        MetafieldFields.filter((item) => !['owner_id', 'owner_resource'].includes(item)).forEach(
          (key) => {
            switch (key) {
              case 'id':
                row[key] = getFieldValue(metafield[key])
                break

              default:
                row[key] = i === 0 ? getFieldValue(metafield[key]) : ''
                break
            }
          }
        )

        rows.push(row)
      }
    }

    return rows
  } catch (error) {
    throw error
  }
}

const convertCustomer = (dataList) => {
  try {
    let rows = []

    for (let ii = 0, leng = dataList.length; ii < leng; ii++) {
      const { customer, addresses, metafields } = dataList[ii]

      const length = Math.max(addresses.length || metafields.length || 1)

      for (let i = 0; i < length; i++) {
        let row = {}

        CustomerFields.forEach((key) => {
          switch (key) {
            case 'id':
              row[key] = getFieldValue(customer[key])
              break

            default:
              row[key] = i === 0 ? getFieldValue(customer[key]) : ''
              break
          }
        })
        CustomerAddressFields.forEach(
          (key) => (row['address_' + key] = getFieldValue(addresses[i]?.[key]))
        )
        MetafieldFields.forEach(
          (key) => (row['metafield_' + key] = getFieldValue(metafields[i]?.[key]))
        )

        rows.push(row)
      }
    }

    return rows
  } catch (error) {
    throw error
  }
}

const convertData = (type, dataList) => {
  try {
    switch (type) {
      case 'product':
        return convertProduct(dataList)

      case 'custom_collection':
        return convertCustomCollection(dataList)

      case 'smart_collection':
        return convertSmartCollection(dataList)

      case 'page':
        return convertPage(dataList)

      case 'blog':
        return convertBlog(dataList)

      case 'file':
        return convertFile(dataList)

      case 'redirect':
        return convertRedirect(dataList)

      case 'metafield':
        return convertMetafield(dataList)
        return convertRedirect(dataList)

      case 'customer':
        return convertCustomer(dataList)

      default:
        throw new Error('Invalid resource type')
    }
  } catch (error) {
    console.log('convertData error :>> ', error)
    throw error
  }
}

export default convertData
