import { Badge, Button, Card, DisplayText, Stack, TextField } from '@shopify/polaris'
import { useState } from 'react'
import { useCopyToClipboard } from '../../hooks'

function UniqueCodeCard(props) {
  const { actions, uniqueCodes } = props

  return (
    <Card>
      <Card.Section>
        <Stack distribution="center">
          <DisplayText size="small">Resource Store</DisplayText>
        </Stack>
      </Card.Section>
      {uniqueCodes.map((item, index) => (
        <Card.Section key={index}>
          <Stack vertical spacing="tight" alignment="fill">
            <p>Your store unique code</p>
            {['ARENACOMMERCE'].includes(props.storeSetting.role) && (
              <Badge>
                <span style={{ fontSize: '0.9em', textTransform: 'uppercase' }}>
                  {item.permission.replace(/_/g, ' ')} PERMISSION
                </span>
              </Badge>
            )}
            <Stack distribution="equalSpacing" alignment="baseline" spacing="tight">
              <Stack.Item fill>
                <TextField value={item.code} disabled />
              </Stack.Item>
              <Button
                onClick={() =>
                  useCopyToClipboard(item.code)
                    ? actions.showNotify({ message: 'Copied' })
                    : actions.showNotify({ message: '#Error', error: true })
                }
              >
                Copy
              </Button>
            </Stack>
          </Stack>
        </Card.Section>
      ))}
      <Card.Section>
        <Button fullWidth primary onClick={() => props.navigate('/export/new')}>
          New export data
        </Button>
      </Card.Section>
      <Card.Section subdued>
        <Stack vertical alignment="fill" spacing="extraTight">
          {/* <Stack distribution="center">
            <DisplayText size="small">
              <span className="color__note">What is resource store?</span>
            </DisplayText>
          </Stack> */}
          <Stack distribution="center">
            <div className="color__note" style={{ textAlign: 'center', whiteSpace: 'normal' }}>
              Use this key to link with another store to active destination store mode.
            </div>
          </Stack>
        </Stack>
      </Card.Section>
    </Card>
  )
}

export default UniqueCodeCard
