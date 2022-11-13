import { Stack } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import CreateForm from './CreateForm'

function IndexPage(props) {
  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Create new export"
        onBack={() => props.navigate('export')}
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('support'),
          },
        ]}
      />

      <CreateForm {...props} created={{}} onDiscard={() => props.navigate('export')} />
    </Stack>
  )
}

export default IndexPage
