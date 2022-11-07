import Routes from './Routes'
import { useEffect, useState } from 'react'
import { Stack } from '@shopify/polaris'
import AppNavigation from './components/AppNavigation'

export default function App(props) {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)')

  let primaryActions = [
    {
      label: 'Home',
      pathname: '/',
    },
    // {
    //   label: 'Products',
    //   pathname: '/products',
    // },
    {
      label: 'Export',
      pathname: '/export',
    },
    {
      label: 'Import',
      pathname: '/import',
    },
    {
      label: 'Background Jobs',
      pathname: '/background-jobs',
    },
  ]
  if (['haloha-shop.myshopify.com'].includes(window.shopOrigin)) {
    primaryActions = primaryActions.concat([
      {
        label: 'Navigation',
        pathname: '/navigation',
      },
      // {
      //   label: 'Clear Store',
      //   pathname: '/clear-store',
      // },
    ])
  }

  return (
    <Stack vertical alignment="fill">
      <AppNavigation
        primaryActions={primaryActions}
        secondaryActions={[
          {
            label: 'Pricing plans',
            pathname: '/pricing-plans',
          },
        ]}
        secondaryMoreActions={{
          items: [
            // { label: 'Settings', pathname: '/settings' },
            { label: 'FAQs', pathname: '/faq' },
            { label: 'Support', pathname: '/support' },
            { label: 'Privacy', pathname: '/privacy' },
          ],
        }}
        isFullscreen={props.isFullscreen}
        onToggleFullscreen={props.onToggleFullscreen}
      />

      <Routes pages={pages} appProps={props} />
    </Stack>
  )
}
