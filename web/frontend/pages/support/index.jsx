import { Stack } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'

function IndexPage(props) {
  return (
    <Stack vertical alignment="fill">
      <AppHeader {...props} title="Support" onBack={() => props.navigate('/')} />
    </Stack>
  )
}

export default IndexPage
