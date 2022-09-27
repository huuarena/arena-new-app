import { Stack } from '@shopify/polaris'
import React from 'react'
import AppHeader from '../../components/AppHeader'
import CreateForm from './CreateForm'

function NewPage(props) {
  return (
    <Stack vertical alignment="fill">
      <AppHeader {...props} title="Add product" onBack={() => props.navigate('/products')} />

      <CreateForm {...props} />
    </Stack>
  )
}

export default NewPage
