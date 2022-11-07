import { Layout, Stack } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import CreateForm from './CreateForm'

function SupportPage(props) {
  return (
    <Stack vertical alignment="fill">
      <AppHeader {...props} title="Support" onBack={() => props.navigate('/')} />

      <Layout>
        <Layout.AnnotatedSection
          title="Contact us"
          description="From tech to tilt, we're here to help you! Submit a Ticket! So long as a poro doesn't eat it, we'll get back to you soon."
        >
          <CreateForm {...props} onSubmit={() => null} />
        </Layout.AnnotatedSection>
      </Layout>
    </Stack>
  )
}

export default SupportPage
