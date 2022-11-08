export const DataTypes = {
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  datetime: 'datetime',
}

export const ConditionTypes = { all: 'all', any: 'any' }

export const ConditionOptions = {
  string: [
    'is_equal_to',
    'is_not_equal_to',
    'starts_with',
    'ends_with',
    'contains',
    'does_not_contain',
    'is_empty',
    'is_not_empty',
  ],
  number: [
    'is_equal_to',
    'is_not_equal_to',
    'is_greater_than',
    'is_greater_than_or_equal',
    'is_less_than',
    'is_less_than_or_equal',
  ],
  boolean: ['is_equal_to'],
  datetime: [
    'is_equal_to',
    'is_not_equal_to',
    'is_greater_than',
    'is_greater_than_or_equal',
    'is_less_than',
    'is_less_than_or_equal',
  ],
}

export const ConditionResources = {
  metafield: [
    {
      field: 'namespace',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'key',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'value',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'description',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'type',
      type: DataTypes.string,
      values: [
        'single_line_text_field',
        'multi_line_text_field',
        'boolean',
        'color',
        'date',
        'date_time',
        'dimension',
        'file_reference',
        'json',
        'money',
        'number_decimal',
        'number_integer',
        'page_reference',
        'product_reference',
        'rating',
        'url',
        'variant_reference',
        'volume',
        'weight',
      ],
    },
  ],
  option: [
    {
      field: 'name',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'value',
      type: DataTypes.string,
      values: [],
    },
  ],
  variant: [
    {
      field: 'price',
      type: DataTypes.number,
      values: [],
    },
    {
      field: 'sku',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'inventory_policy',
      type: DataTypes.string,
      values: ['deny', 'continue'],
    },
    {
      field: 'compare_at_price',
      type: DataTypes.number,
      values: [],
    },
    {
      field: 'fulfillment_service',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'inventory_management',
      type: DataTypes.string,
      values: ['shopify', 'null'],
    },
    {
      field: 'taxable',
      type: DataTypes.boolean,
      values: ['true', 'false'],
    },
    {
      field: 'barcode',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'grams',
      type: DataTypes.number,
      values: [],
    },
    {
      field: 'weight',
      type: DataTypes.number,
      values: [],
    },
    {
      field: 'weight_unit',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'inventory_quantity',
      type: DataTypes.number,
      values: [],
    },
    {
      field: 'old_inventory_quantity',
      type: DataTypes.number,
      values: [],
    },
    {
      field: 'requires_shipping',
      type: DataTypes.boolean,
      values: ['true', 'false'],
    },
  ],
  product: [
    {
      field: 'title',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'body_html',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'vendor',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'product_type',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'created_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'handle',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'updated_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'published_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'template_suffix',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'status',
      type: DataTypes.string,
      values: ['active', 'archived', 'draft'],
    },
    {
      field: 'published_scope',
      type: DataTypes.string,
      values: ['web', 'global'],
    },
    {
      field: 'tags',
      type: DataTypes.string,
      values: [],
    },
  ],
  custom_collection: [
    {
      field: 'title',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'handle',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'updated_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'body_html',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'published_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'sort_order',
      type: DataTypes.string,
      values: [
        'alpha-asc',
        'alpha-desc',
        'best-selling',
        'created',
        'created-desc',
        'manual',
        'price-asc',
        'price-desc',
      ],
    },
    {
      field: 'template_suffix',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'published_scope',
      type: DataTypes.string,
      values: ['web', 'global'],
    },
  ],
  smart_collection: [
    {
      field: 'title',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'handle',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'updated_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'body_html',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'published_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'sort_order',
      type: DataTypes.string,
      values: [
        'alpha-asc',
        'alpha-desc',
        'best-selling',
        'created',
        'created-desc',
        'manual',
        'price-asc',
        'price-desc',
      ],
    },
    {
      field: 'template_suffix',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'published_scope',
      type: DataTypes.string,
      values: ['web', 'global'],
    },
    {
      field: 'disjunctive',
      type: DataTypes.boolean,
      values: ['true', 'false'],
    },
  ],
  page: [
    {
      field: 'title',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'handle',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'body_html',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'author',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'created_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'updated_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'published_scope',
      type: DataTypes.string,
      values: ['web', 'global'],
    },
    {
      field: 'template_suffix',
      type: DataTypes.string,
      values: [],
    },
  ],
  blog: [
    {
      field: 'title',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'handle',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'updated_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'commentable',
      type: DataTypes.string,
      values: ['no', 'yes', 'moderate'],
    },
    {
      field: 'feedburner',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'feedburner_location',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'created_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'template_suffix',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'tags',
      type: DataTypes.string,
      values: [],
    },
  ],
  customer: [
    {
      field: 'email',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'first_name',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'last_name',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'orders_count',
      type: DataTypes.number,
      values: [],
    },
    {
      field: 'state',
      type: DataTypes.string,
      values: ['disabled', 'invited', 'enabled', 'declined'],
    },
    {
      field: 'total_spent',
      type: DataTypes.number,
      values: [],
    },
    {
      field: 'note',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'verified_email',
      type: DataTypes.boolean,
      values: ['true', 'false'],
    },
    {
      field: 'tax_exempt',
      type: DataTypes.boolean,
      values: ['true', 'false'],
    },
    {
      field: 'tags',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'currency',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'phone',
      type: DataTypes.string,
      values: [],
    },
    {
      field: 'created_at',
      type: DataTypes.datetime,
      values: [],
    },
    {
      field: 'updated_at',
      type: DataTypes.datetime,
      values: [],
    },
  ],
}

export const generateConditions = (type) => {
  try {
    let fields = ConditionResources[type]

    switch (type) {
      case 'product':
        fields = [
          ...fields,
          ...ConditionResources['option'].map((item) => ({
            ...item,
            field: 'option_' + item.field,
          })),
          ...ConditionResources['variant'].map((item) => ({
            ...item,
            field: 'variant_' + item.field,
          })),
          ...ConditionResources['metafield'].map((item) => ({
            ...item,
            field: 'metafield_' + item.field,
          })),
        ]
        break

      case 'custom_collection':
      case 'smart_collection':
      case 'page':
      case 'blog':
      case 'customer':
        fields = [
          ...fields,
          ...ConditionResources['metafield'].map((item) => ({
            ...item,
            field: 'metafield_' + item.field,
          })),
        ]
        break

      default:
        break
    }

    let conditions = fields.map((field) => ({
      type: field.type,
      field: field.field,
      fields: fields.map((item) => item.field),
      condition: ConditionOptions[field.type][0],
      conditions: ConditionOptions[field.type],
      value: field.values[0] || '',
      values: field.values || [],
      error: '',
    }))

    return conditions
  } catch (error) {
    console.log('generateConditions error :>> ', error)
    throw error
  }
}

export const generateFilter = (type) => {
  try {
    return {
      type: ConditionTypes.all,
      conditions: [
        {
          type: ConditionTypes.all,
          conditions: generateConditions(type),
        },
      ],
    }
  } catch (error) {
    console.log('generateFilter error :>> ', error)
    throw error
  }
}

export const filterConditionLv2 = (resource, conditionItem) => {
  try {
    const { type, field, condition, value } = conditionItem

    // filter by specific field
    switch (field) {
      case 'option_name':
        if (resource.options) {
          for (let i = 0; i < resource.options.length; i++) {
            let _value = resource.options[i][field.replace('option_', '')]

            if (
              (condition === 'is_equal_to' && _value == value) ||
              (condition === 'starts_with' && _value.startsWith(value)) ||
              (condition === 'ends_with' && _value.endsWith(value)) ||
              (condition === 'contains' && _value.includes(value))
            ) {
              return true
            }
          }
        }
        return false

      case 'option_value':
        if (resource.options) {
          let values = []
          resource.options.forEach((item) => (values = values.concat(item.values)))

          for (let i = 0; i < values.length; i++) {
            let _value = values[i]

            if (
              (condition === 'is_equal_to' && _value == value) ||
              (condition === 'starts_with' && _value.startsWith(value)) ||
              (condition === 'ends_with' && _value.endsWith(value)) ||
              (condition === 'contains' && _value.includes(value))
            ) {
              return true
            }
          }
        }
        return false

      case 'variant_price':
      case 'variant_compare_at_price':
      case 'variant_grams':
      case 'variant_weight':
      case 'variant_weight_unit':
      case 'variant_inventory_quantity':
      case 'variant_old_inventory_quantity':
        if (resource.variants) {
          for (let i = 0; i < resource.variants.length; i++) {
            let _value = resource.variants[i][field.replace('variant_', '')]

            if (
              (condition === 'is_equal_to' && parseInt(_value) == parseInt(value)) ||
              (condition === 'is_greater_than' && parseInt(_value) > parseInt(value)) ||
              (condition === 'is_greater_than_or_equal' && parseInt(_value) >= parseInt(value)) ||
              (condition === 'is_less_than' && parseInt(_value) < parseInt(value)) ||
              (condition === 'is_less_than_or_equal' && parseInt(_value) <= parseInt(value))
            ) {
              return true
            }
          }
        }
        return false

      case 'variant_sku':
      case 'variant_inventory_policy':
      case 'variant_fulfillment_service':
      case 'variant_inventory_management':
      case 'variant_barcode':
        if (resource.variants) {
          for (let i = 0; i < resource.variants.length; i++) {
            let _value = resource.variants[i][field.replace('variant_', '')]

            if (
              (condition === 'is_equal_to' && _value == value) ||
              (condition === 'starts_with' && _value.startsWith(value)) ||
              (condition === 'ends_with' && _value.endsWith(value)) ||
              (condition === 'contains' && _value.includes(value))
            ) {
              return true
            }
          }
        }
        return false

      case 'variant_taxable':
      case 'variant_requires_shipping':
        if (resource.variants) {
          for (let i = 0; i < resource.variants.length; i++) {
            let _value = resource.variants[i][field.replace('variant_', '')]

            if (condition === 'is_equal_to' && Boolean(_value) == Boolean(value)) {
              return true
            }
          }
        }
        return false

      case 'metafield_namespace':
      case 'metafield_key':
      case 'metafield_value':
      case 'metafield_description':
      case 'metafield_type':
        if (resource.metafields) {
          for (let i = 0; i < resource.metafields.length; i++) {
            let _value = resource.metafields[i][field.replace('metafield_', '')]

            if (
              (condition === 'is_equal_to' && _value == value) ||
              (condition === 'starts_with' && _value.startsWith(value)) ||
              (condition === 'ends_with' && _value.endsWith(value)) ||
              (condition === 'contains' && _value.includes(value))
            ) {
              return true
            }
          }
        }
        return false

      default:
        break
    }

    switch (condition) {
      case 'is_equal_to':
        if (type === DataTypes.datetime) {
          return new Date(resource[field]).getTime() == new Date(value).getTime()
        }
        if (type === DataTypes.boolean) {
          return Boolean(resource[field]) == Boolean(value)
        }
        if (type === DataTypes.number) {
          return parseInt(resource[field]) == parseInt(value)
        }
        return String(resource[field]) == String(value)

      case 'is_not_equal_to':
        if (type === DataTypes.datetime) {
          return new Date(resource[field]).getTime() != new Date(value).getTime()
        }
        if (type === DataTypes.boolean) {
          return Boolean(resource[field]) != Boolean(value)
        }
        if (type === DataTypes.number) {
          return parseInt(resource[field]) != parseInt(value)
        }
        return String(resource[field]) != String(value)

      case 'is_greater_than':
        if (type === DataTypes.datetime) {
          return new Date(resource[field]).getTime() > new Date(value).getTime()
        }
        return parseInt(resource[field]) > parseInt(value)

      case 'is_greater_than_or_equal':
        if (type === DataTypes.datetime) {
          return new Date(resource[field]).getTime() >= new Date(value).getTime()
        }
        return parseInt(resource[field]) >= parseInt(value)

      case 'is_less_than':
        if (type === DataTypes.datetime) {
          return new Date(resource[field]).getTime() < new Date(value).getTime()
        }
        return parseInt(resource[field]) < parseInt(value)

      case 'is_less_than_or_equal':
        if (type === DataTypes.datetime) {
          return new Date(resource[field]).getTime() <= new Date(value).getTime()
        }
        return parseInt(resource[field]) <= parseInt(value)

      case 'starts_with':
        return Boolean(resource[field]?.startsWith(value))

      case 'ends_with':
        return Boolean(resource[field]?.endsWith(value))

      case 'contains':
        return Boolean(resource[field]?.includes(value))

      case 'does_not_contain':
        return !Boolean(resource[field]?.includes(value))

      case 'is_empty':
        return String(resource[field]) == ''

      case 'is_not_empty':
        return String(resource[field]) != ''

      default:
        break
    }

    return false
  } catch (error) {
    console.log('filterConditionLv2 error :>> ', error)
    throw error
  }
}

export const filterConditionLv1 = (resource, condition) => {
  try {
    const { type, conditions } = condition

    let bool = true

    switch (type) {
      case 'all':
        for (let i = 0; i < conditions.length; i++) {
          bool = filterConditionLv2(resource, conditions[i])

          if (!bool) {
            return false
          }
        }
        return true

      case 'any':
        for (let i = 0; i < conditions.length; i++) {
          bool = filterConditionLv2(resource, conditions[i])

          if (bool) {
            return true
          }
        }
        return false

      default:
        break
    }

    return false
  } catch (error) {
    console.log('filterConditionLv1 error :>> ', error)
    throw error
  }
}

export const filterCondition = (resource, condition) => {
  try {
    const { type, conditions } = condition

    let bool = true

    switch (type) {
      case 'all':
        for (let i = 0; i < conditions.length; i++) {
          bool = filterConditionLv1(resource, conditions[i])

          if (!bool) {
            return false
          }
        }
        return true

      case 'any':
        for (let i = 0; i < conditions.length; i++) {
          bool = filterConditionLv1(resource, conditions[i])

          if (bool) {
            return true
          }
        }
        return false

      default:
        break
    }

    return false
  } catch (error) {
    console.log('filterCondition error :>> ', error)
    throw error
  }
}

export const checkHasMetafieldFilter = (filter) => {
  try {
    for (let i = 0; i < filter.conditions.length; i++) {
      for (let j = 0; j < filter.conditions[i].conditions.length; j++) {
        if (filter.conditions[i].conditions[j].field.includes('metafield')) {
          return true
        }
      }
    }

    return false
  } catch (error) {
    console.log('checkHasMetafieldFilter error :>> ', error)
    throw error
  }
}

export const generateSampleConditions = () => {
  let resources = [
    'product',
    'custom_collection',
    'smart_collection',
    'page',
    'blog',
    'metafield',
    'customer',
  ]
  let obj = {}

  resources.forEach((resource) => (obj[resource] = generateConditions(resource)))

  return obj
}
