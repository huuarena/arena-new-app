import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Modal, RadioButton, Select, Stack } from '@shopify/polaris'
import formatDateTime from '../../helpers/formatDateTime'
import FormControl from '../../components/FormControl'

ConfirmImportTheme.propTypes = {
  // ...appProps,
  selected: PropTypes.object,
  onDiscard: PropTypes.func,
  onSubmit: PropTypes.func,
  permission: PropTypes.string,
}

ConfirmImportTheme.defaultProps = {
  selected: null,
  onDiscard: () => null,
  onSubmit: () => null,
  permission: 'ALL',
}

const Types = [
  { label: 'Create new theme', value: 'create' },
  { label: 'Import to existing theme', value: 'update' },
]

const initFormData = {
  themeName: {
    type: 'text',
    label: 'Enter new theme name',
    placeholder: 'name',
    value: '',
    error: '',
    required: true,
    validate: {
      trim: true,
      required: [true, 'Required!'],
      minlength: [2, 'Too short!'],
      maxlength: [200, 'Too long!'],
    },
  },
  themeId: {
    type: 'select',
    label: 'Select a theme',
    value: '',
    error: '',
    required: true,
    validate: {},
    options: [],
  },
}

function ConfirmImportTheme(props) {
  const { actions, themes, selected, onSubmit, onDiscard, permission } = props

  const versions = selected.versions.filter((item) => item.status === 'COMPLETED' && item.result?.Location)

  const [version, setVersion] = useState(versions[0])
  const [type, setType] = useState(Types[0].value)
  const [formData, setFormData] = useState(initFormData)

  useEffect(() => {
    let name = version.result.resources?.[0]?.theme?.name
    name = `${name} ${permission === 'ALL' ? 'clone' : 'demo'} - ${new Date().toUTCString()}`

    let _formData = JSON.parse(JSON.stringify(initFormData))
    _formData.themeName = { ..._formData.themeName, value: name }
    _formData.themeId = {
      ..._formData.themeId,
      value: '' + themes[0].id,
      options: themes.map((item) => ({
        label: `${item.name}${item.role === 'main' ? ' (Published)' : ''}`,
        value: '' + item.id,
      })),
    }
    setFormData(_formData)
  }, [])

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    setFormData(_formData)
  }

  const handleToggleType = (value) => {
    setType(value)

    if (value === 'create') {
      let name = version.result.resources?.[0]?.theme?.name
      name = `${name} ${permission === 'ALL' ? 'clone' : 'demo'} - ${new Date().toUTCString()}`

      let _formData = JSON.parse(JSON.stringify(formData))
      _formData.themeName = { ..._formData.themeName, value: name }
      setFormData(_formData)
    }
  }

  return (
    <Modal
      open={true}
      onClose={onDiscard}
      title="Import confirmation"
      secondaryActions={[
        {
          content: 'Discard',
          onAction: onDiscard,
        },
        {
          content: 'Import now',
          onAction: () => {
            switch (type) {
              case 'create':
                if (!formData.themeName.value) {
                  let _formData = { ...formData }
                  _formData.themeName.error = 'Theme name cannot be blank'
                  setFormData(_formData)
                } else {
                  onSubmit({
                    version,
                    themeName: formData.themeName.value,
                  })
                }
                break

              default:
                // update
                if (!formData.themeId.value) {
                  let _formData = { ...formData }
                  _formData.themeId.error = 'Theme cannot be blank'
                  setFormData(_formData)
                } else {
                  onSubmit({
                    version,
                    themeId: formData.themeId.value,
                  })
                }
                break
            }
          },
          primary: true,
        },
      ]}
    >
      {versions.length === 0 && (
        <Modal.Section subdued>
          <Stack distribution="center">
            <div>No packages available</div>
          </Stack>
        </Modal.Section>
      )}
      {versions.length > 0 && (
        <Modal.Section subdued>
          <Select
            label="Select a package"
            options={versions.map((item, index) => ({
              label: `${item.version} - ${item.name}`,
              value: '' + item.id,
            }))}
            value={'' + version.id}
            onChange={(value) => setVersion(versions.find((item) => '' + item.id === value))}
          />
        </Modal.Section>
      )}
      {version && (
        <Modal.Section subdued>
          <Stack vertical alignment="fill">
            <Stack vertical spacing="extraTight">
              <Stack spacing="tight" wrap={false}>
                <div style={{ minWidth: 90 }}>Name</div>
                <div>:</div>
                <div>{version.name}</div>
              </Stack>
              <Stack spacing="tight" wrap={false}>
                <div style={{ minWidth: 90 }}>Description</div>
                <div>:</div>
                <div style={{ maxWidth: 300 }}>{version.description}</div>
              </Stack>
              <Stack spacing="tight" wrap={false}>
                <div style={{ minWidth: 90 }}>Last updated</div>
                <div>:</div>
                <div>{formatDateTime(version.updatedAt, 'LLL')}</div>
              </Stack>
            </Stack>
          </Stack>
        </Modal.Section>
      )}
      {version && (
        <Modal.Section subdued>
          <Stack vertical alignment="fill">
            <Stack distribution="fillEvenly">
              {Types.map((item, index) => (
                <Stack.Item fill key={index}>
                  <RadioButton
                    name="types"
                    label={item.label}
                    checked={item.value === type}
                    onChange={() => handleToggleType(item.value)}
                    disabled={item.value === 'update' && permission !== 'ALL'}
                  />
                </Stack.Item>
              ))}
            </Stack>
            {type === 'create' && (
              <Stack.Item fill>
                <FormControl {...formData['themeName']} onChange={(value) => handleChange('themeName', value)} />
              </Stack.Item>
            )}
            {type === 'update' && (
              <Stack.Item fill>
                <FormControl {...formData['themeId']} onChange={(value) => handleChange('themeId', value)} />
              </Stack.Item>
            )}
          </Stack>
        </Modal.Section>
      )}
    </Modal>
  )
}

export default ConfirmImportTheme
