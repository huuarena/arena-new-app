import { Banner, Page, Stack } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import CreateForm from './CreateForm'

function IndexPage(props) {
  return (
    <Page>
      <Stack vertical alignment="fill">
        <AppHeader
          {...props}
          title="Clear all store data"
          onBack={() => props.navigate('/')}
          primaryActions={[
            {
              label: 'Contact us',
              onClick: () => props.navigate('/support'),
            },
          ]}
        />

        <Banner status="warning">
          <p>
            Clearing all store data cannot be undone. Please backup data and check carefully before
            clearing!
          </p>
        </Banner>

        <CreateForm {...props} onDiscard={() => props.navigate('/support')} onSubmit={() => null} />
      </Stack>
    </Page>
  )
}

export default IndexPage
