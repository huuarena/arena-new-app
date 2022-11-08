export const ValidResources = [
  'product',
  'custom_collection',
  'smart_collection',
  'page',
  'blog',
  'shop',
  'file',
  'customer',
  'discount_code',
  'draft_order',
  'order',
  'redirect',
  'metafield',
]

export const ProductFields = [
  'id',
  'title',
  'body_html',
  'vendor',
  'product_type',
  'handle',
  'published_at',
  'template_suffix',
  'status',
  'published_scope',
  'tags',
  'options',
]

export const MetafieldFields = [
  'id',
  'namespace',
  'key',
  'value',
  'description',
  'owner_id',
  'owner_resource',
  'type',
]

export const VariantFields = [
  'id',
  'product_id',
  'title',
  'price',
  'sku',
  'position',
  'inventory_policy',
  'compare_at_price',
  'fulfillment_service',
  'inventory_management',
  'option1',
  'option2',
  'option3',
  'taxable',
  'barcode',
  'grams',
  'image_id',
  'weight',
  'weight_unit',
  'inventory_item_id',
  'inventory_quantity',
  'old_inventory_quantity',
  'requires_shipping',
]

export const ProductImageFields = ['id', 'position', 'alt', 'width', 'height', 'src', 'variant_ids']

export const CollectionImageFields = ['alt', 'src', 'width', 'height']

export const CustomCollectionFields = [
  'id',
  'handle',
  'title',
  'body_html',
  'published_at',
  'sort_order',
  'template_suffix',
  'published_scope',
]

export const SmartCollectionFields = [
  'id',
  'handle',
  'title',
  'body_html',
  'published_at',
  'sort_order',
  'template_suffix',
  'disjunctive',
  'published_scope',
]

export const SmartCollectionRuleFields = ['column', 'relation', 'condition']

export const PageFields = [
  'id',
  'title',
  'handle',
  'body_html',
  'author',
  'published_at',
  'template_suffix',
]

export const BlogFields = [
  'id',
  'handle',
  'title',
  'commentable',
  'feedburner',
  'feedburner_location',
  'template_suffix',
  'tags',
]

export const ArticleFields = [
  'id',
  'title',
  'body_html',
  'blog_id',
  'author',
  'user_id',
  'published_at',
  'summary_html',
  'template_suffix',
  'handle',
  'tags',
]

export const ArticleImageFields = ['owner_id', 'alt', 'width', 'height', 'src']

export const FileFields = ['id', 'alt', 'url', 'contentType']

export const RedirectFields = ['id', 'path', 'target']

export const CustomerFields = [
  'id',
  'email',
  'first_name',
  'last_name',
  'orders_count',
  'state',
  'total_spent',
  'note',
  'verified_email',
  'tax_exempt',
  'tags',
  'currency',
  'phone',
]

export const CustomerAddressFields = [
  'id',
  'first_name',
  'last_name',
  'company',
  'address1',
  'address2',
  'city',
  'province',
  'country',
  'zip',
  'phone',
  'name',
  'province_code',
  'country_code',
  'country_name',
  'default',
]
