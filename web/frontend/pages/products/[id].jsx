import { Stack } from '@shopify/polaris'
import { useState, useEffect } from 'react'
import ProductApi from '../../apis/product'
import AppHeader from '../../components/AppHeader'
import MySkeletonPage from '../../components/MySkeletonPage'
import CreateForm from './CreateForm'

function DetailPage(props) {
  const id = props.location.pathname.split('/')[props.location.pathname.split('/').length - 1]

  const [created, setCreated] = useState(null)

  const getById = async () => {
    try {
      let res = await ProductApi.findById(id)
      if (!res.success) throw res.error

      setCreated(res.data.product)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    getById(id)
  }, [])

  return (
    <Stack vertical alignment="fill">
      <AppHeader {...props} title="Edit product" onBack={() => props.navigate('/products')} />

      {created ? <CreateForm {...props} created={created} /> : <MySkeletonPage />}
    </Stack>
  )
}

export default DetailPage
