import { Button, Card, DisplayText, Layout, Select, Stack } from '@shopify/polaris'
import { useState } from 'react'
import AppHeader from '../../components/AppHeader'

function IndexPage(props) {
  const { actions, duplicators } = props

  const [selected, setSelected] = useState(duplicators[0] ? duplicators[0].originShop.shop : '')

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Export/Import Navigation"
        onBack={() => props.navigate('')}
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('support'),
          },
        ]}
      />

      <Layout>
        <Layout.Section oneHalf>
          <Card>
            <Card.Section>
              <Stack distribution="center">
                <DisplayText size="small">Export navigation</DisplayText>
              </Stack>
            </Card.Section>
            <Card.Section>
              <Stack distribution="center">
                <Button
                  primary
                  external
                  url={`https://${window.shopOrigin}/admin/menus?firstShow=0&arnAction=export-menu&app=acopy`}
                >
                  Export navigation
                </Button>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card>
            <Card.Section>
              <Stack distribution="center">
                <DisplayText size="small">Import navigation</DisplayText>
              </Stack>
            </Card.Section>
            <Card.Section>
              <Select
                options={duplicators.map((item) => ({
                  label: item.originShop.shop,
                  value: item.originShop.shop,
                }))}
                value={selected}
                onChange={setSelected}
                disabled={duplicators.length <= 1}
              />
            </Card.Section>
            <Card.Section>
              <Stack distribution="center">
                <Button
                  primary
                  external
                  url={`https://${window.shopOrigin}/admin/menus?firstShow=0&arnAction=import-menu&app=acopy&shop=${selected}`}
                  disabled={!Boolean(selected)}
                >
                  Import navigation
                </Button>
              </Stack>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Stack>
  )
}

export default IndexPage
