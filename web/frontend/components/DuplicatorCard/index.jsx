import { Badge, Button, Card, DisplayText, Stack, TextField } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import DuplicatorApi from '../../apis/duplicator'

const initFormData = {
  code: { value: '', error: '', placeholder: 'xxxx-xxxx-xxxx-xxxx' },
}

function DuplicatorCard(props) {
  const { actions, navigate, duplicators } = props

  const [formData, setFormData] = useState(initFormData)

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    setFormData(_formData)
  }

  const handleSubmit = async () => {
    try {
      actions.showAppLoading()

      let res = await DuplicatorApi.activeCode({ code: formData['code'].value })
      if (!res.success) throw res.error

      actions.getDuplicators()

      actions.showNotify({ message: 'Unique code actived' })

      setFormData(initFormData)
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  return (
    <Card>
      <Card.Section>
        <Stack distribution="center">
          <DisplayText size="small">Active Destination Store Mode</DisplayText>
        </Stack>
      </Card.Section>
      <Card.Section subdued>
        <Stack vertical distribution="fill" spacing="tight">
          <div>Add unique code from resource store</div>
          <Stack distribution="equalSpacing" alignment="baseline" spacing="tight">
            <Stack.Item fill>
              <TextField
                {...formData['code']}
                onChange={(value) => handleChange('code', value)}
                clearButton
                onClearButtonClick={() => handleChange('code', '')}
              />
            </Stack.Item>
            <Button
              onClick={handleSubmit}
              primary={Boolean(formData['code'].value)}
              disabled={!Boolean(formData['code'].value)}
            >
              Active code
            </Button>
          </Stack>
        </Stack>
      </Card.Section>
      {/* {duplicators.map((item, index) => (
        <Card.Section key={index}>
          <Stack vertical spacing="tight" alignment="fill">
            {['ARENACOMMERCE'].includes(props.storeSetting.role) && (
              <Badge>
                <span style={{ fontSize: '0.9em', textTransform: 'uppercase' }}>
                  {item.code?.permission?.replace(/_/g, ' ')} PERMISSION
                </span>
              </Badge>
            )}
            <Stack distribution="equalSpacing" alignment="baseline" spacing="tight">
              <Stack.Item fill>
                <TextField value={`${item.originShop?.name} (${item.originShop?.shop})`} disabled />
              </Stack.Item>
              <Button onClick={() => navigate('/import')}>View packages</Button>
            </Stack>
          </Stack>
        </Card.Section>
      ))} */}
      <Card.Section>
        <Button
          fullWidth
          primary
          onClick={() => props.navigate('/import')}
          disabled={!Boolean(duplicators.length >= 1)}
        >
          New import data
        </Button>
      </Card.Section>
      <Card.Section subdued>
        <Stack vertical alignment="fill" spacing="extraTight">
          {/* <Stack distribution="center">
            <DisplayText size="small">
              <span className="color__note">What is destination store?</span>
            </DisplayText>
          </Stack> */}
          <Stack distribution="center">
            <div className="color__note" style={{ textAlign: 'center', whiteSpace: 'normal' }}>
              Enter resource store unique code from another store that installed AClone.
            </div>
          </Stack>
        </Stack>
      </Card.Section>
    </Card>
  )
}

export default DuplicatorCard
