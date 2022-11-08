import PropTypes from 'prop-types'
import { Button, Card, Checkbox, OptionList, Stack } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import ConfirmModal from '../../components/ConfirmModal'
import ClearStoreApi from '../../apis/clear_store'

CreateForm.propTypes = {
  // ...appProps,
  onDiscard: PropTypes.func,
  onSubmit: PropTypes.func,
}

CreateForm.defaultProps = {
  onDiscard: () => null,
  onSubmit: () => null,
}

const ALL_RESOURCES = [
  'product',
  'custom_collection',
  'smart_collection',
  'customer',
  'page',
  'blog',
  'redirect',
  'metafield',
  'file',
]

const initFormData = {
  resources: {
    label: 'Select resources you want to clear all data',
    value: [],
    error: '',
  },
}

function CreateForm(props) {
  const { actions, onDiscard, onSubmit } = props

  const [formData, setFormData] = useState(initFormData)
  const [openConfirm, setOpenConfirm] = useState(false)

  useEffect(() => console.log('formData :>> ', formData), [formData])

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    setFormData(_formData)
  }

  const handleSubmit = async () => {
    try {
      actions.showAppLoading()

      let data = { resources: formData['resources'].value }

      let res = await ClearStoreApi.clear(data)
      if (!res.success) throw res.error

      actions.showNotify({ message: 'All store data clearing...' })
    } catch (error) {
      console.log(error)
      actions.showNotify({ error: true, message: error.message })
    } finally {
      actions.hideAppLoading()
    }
  }

  return (
    <Stack vertical alignment="fill">
      <Card>
        <Card.Section title={formData['resources'].label}>
          <div style={{ margin: '1em 2em' }}>
            <Stack vertical spacing="tight">
              {ALL_RESOURCES.map((item, index) => (
                <Checkbox
                  key={index}
                  label={
                    item.replace(/_/g, ' ')[0].toUpperCase() +
                    item.replace(/_/g, ' ').slice(1).toLowerCase() +
                    's'
                  }
                  checked={formData['resources'].value.includes(item)}
                  onChange={() => {
                    let _formData = JSON.parse(JSON.stringify(formData))
                    if (_formData['resources'].value.includes(item)) {
                      _formData['resources'].value = _formData['resources'].value.filter(
                        (_item) => _item !== item
                      )
                    } else {
                      _formData['resources'].value.push(item)
                    }
                    setFormData(_formData)
                  }}
                />
              ))}
            </Stack>
          </div>
        </Card.Section>
      </Card>

      <Stack distribution="trailing">
        <Button onClick={onDiscard}>Discard</Button>
        <Button
          primary
          onClick={() => setOpenConfirm(true)}
          disabled={formData['resources'].value.length === 0}
        >
          Submit
        </Button>
      </Stack>

      {openConfirm && (
        <ConfirmModal
          title="Clear all store data confirmation"
          content="Are you sure want to clear all store data of that resources? This cannot be undone."
          onClose={() => setOpenConfirm(null)}
          secondaryActions={[
            {
              content: 'Discard',
              onAction: () => setOpenConfirm(null),
            },
            {
              content: 'Clear all now',
              onAction: () => handleSubmit() & setOpenConfirm(null),
              destructive: true,
            },
          ]}
        />
      )}
    </Stack>
  )
}

export default CreateForm
