import { Card, Pagination, Stack } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import ProductApi from '../../apis/product'
import AppHeader from '../../components/AppHeader'
import Table from './Table'
import { useSearchParams } from 'react-router-dom'
import ConfirmModal from '../../components/ConfirmModal'

function ProductsPage(props) {
  const { actions, location, navigate } = props

  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState(null)
  const [count, setCount] = useState(null)
  const [deleted, setDeleted] = useState(null)

  const getProducts = async (query) => {
    try {
      let res = await ProductApi.find(query)
      if (!res.success) throw res.error

      setProducts(res.data)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    getProducts(location.search)
  }, [location.search])

  const getProductsCount = async () => {
    try {
      let res = await ProductApi.count()
      if (!res.success) throw res.error

      setCount(res.data.count)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    getProductsCount()
  }, [])

  const handleDelete = async (selected) => {
    try {
      actions.showAppLoading()

      let res = await ProductApi.delete(selected.id)
      if (!res.success) throw res.error

      actions.showNotify({ message: 'Deleted' })

      getProducts(location.search)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Products"
        primaryActions={[
          {
            label: 'Add product',
            primary: true,
            onClick: () => props.navigate(`/products/new`),
          },
        ]}
        onBack={() => props.navigate('/')}
      />

      <div>Total products: {count || 'loading..'}</div>

      <Card>
        <Table
          {...props}
          items={products?.products}
          onEdit={(item) => navigate(`/products/${item.id}`)}
          onDelete={(item) => setDeleted(item)}
        />
        {products?.products?.length > 0 && (
          <Card.Section>
            <Stack distribution="center">
              <Stack.Item>
                <Pagination
                  hasPrevious={products.pageInfo.hasPrevious}
                  onPrevious={() =>
                    setSearchParams({ pageInfo: products.pageInfo.previousPageInfo })
                  }
                  hasNext={products.pageInfo.hasNext}
                  onNext={() => setSearchParams({ pageInfo: products.pageInfo.nextPageInfo })}
                />
              </Stack.Item>
            </Stack>
          </Card.Section>
        )}
      </Card>

      {deleted && (
        <ConfirmModal
          title="Delete confirmation"
          content="Are you sure want to delete this product? This cannot be undone."
          onDiscard={() => setDeleted(null)}
          secondaryActions={[
            {
              content: 'Discard',
              onAction: () => setDeleted(null),
            },
            {
              content: 'Delete now',
              onAction: () => {
                handleDelete(deleted)
                setDeleted(null)
              },
              destructive: true,
            },
          ]}
        />
      )}
    </Stack>
  )
}

export default ProductsPage
