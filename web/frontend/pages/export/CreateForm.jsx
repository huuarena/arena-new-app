import PropTypes from 'prop-types'
import { Button, Card, DisplayText, Icon, Select, Stack, TextField } from '@shopify/polaris'
import { useEffect, useState, version } from 'react'
import FormValidate from '../../helpers/formValidate'
import FormControl from '../../components/FormControl'
import ResourceItem from './ResourceItem'
import DuplicatorPackageApi from '../../apis/duplicator_package'
import SelectResources from './SelectResources'
import { ValidResources } from './constants'

CreateForm.propTypes = {
  // ...appProps,
  created: PropTypes.object,
  onDiscard: PropTypes.func,
  version: PropTypes.object,
}

CreateForm.defaultProps = {
  created: {},
  onDiscard: () => null,
  version: null,
}

const CommonResourceFormData = {
  type: { value: '' },
  count: {
    type: 'select',
    label: 'Count',
    value: '20',
    error: '',
    required: true,
    options: [
      { label: '10', value: '10' },
      { label: '20', value: '20' },
      { label: '50', value: '50' },
      { label: '100', value: '100' },
      { label: '500', value: '500' },
      { label: '1000', value: '1000' },
      { label: 'All', value: 'all' },
    ],
  },
  filter: { value: null },
  columns: { value: null },
}

const ThemeResourceFormData = {
  type: { value: '' },
  theme: {
    type: 'select',
    label: 'Select original theme',
    value: '',
    error: '',
    required: true,
    options: [],
  },
}

const initFormData = {
  resourceTypes: {
    value: [],
    error: '',
  },
  resources: [],
  name: {
    type: 'text',
    label: 'Name',
    placeholder: 'name',
    value: '',
    error: '',
    required: true,
  },
  description: {
    type: 'text',
    label: 'Description',
    placeholder: 'description',
    value: '',
    error: '',
    required: true,
    multiline: 4,
  },
  version: {
    type: 'text',
    label: 'Version',
    placeholder: '1.0',
    helpText: 'For each version value is an export package version',
    value: '',
    error: '',
    required: true,
  },
  schedule: {
    type: 'select',
    label: 'Schedule',
    value: 'one-time',
    error: '',
    options: [
      { label: 'One time', value: 'one-time' },
      { label: 'Every 6 hours', value: 'every-6-hours' },
      { label: 'Every 12 hours', value: 'every-12-hours' },
      { label: 'Every day', value: 'every-day' },
      { label: 'Every week', value: 'every-week' },
      { label: 'Every month', value: 'every-month' },
    ],
    disabled: true,
  },
}

function CreateForm(props) {
  const { actions, themes, created, onDiscard, version } = props

  const [formData, setFormData] = useState(null)

  useEffect(() => console.log('formData :>> ', formData), [formData])

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    setFormData(_formData)
  }

  useEffect(() => {
    let _formData = JSON.parse(JSON.stringify(initFormData))

    if (created.id && version) {
      _formData.name.value = version.name
      _formData.description.value = version.description
      _formData.version.value = version.version
      _formData.resourceTypes.value = version.resources.map((item) => item.type)

      if (version.resources.map((item) => item.type).includes('theme')) {
        // export theme
        _formData.resources = version.resources.map((item) => ({
          ...ThemeResourceFormData,
          type: { ...ThemeResourceFormData.type, value: item.type },
          theme: {
            ...ThemeResourceFormData.theme,
            value: item.theme,
            options: themes.map((_item) => ({
              label: _item.name + `${_item.role === 'main' ? ' (Published)' : ''}`,
              value: '' + _item.id,
            })),
          },
        }))
      } else {
        // export common
        _formData.resources = version.resources.map((item) => ({
          ...CommonResourceFormData,
          type: { ...CommonResourceFormData.type, value: item.type },
          count: {
            ...CommonResourceFormData.count,
            value: CommonResourceFormData.count.options.find(
              (_item) => _item.value == '' + item.count
            )
              ? item.count
              : CommonResourceFormData.count.options[0].value,
          },
          filter: { value: item.filter || null },
          columns: { value: item.columns || null },
        }))
      }
    } else {
      _formData.version.value = '1.0'
    }

    setFormData(_formData)
  }, [])

  const handleSubmit = async (type) => {
    try {
      let _formData = JSON.parse(JSON.stringify(formData))
      let formValid = true
      let errMsg = 'Invalid form data'

      if (!_formData.name.value) {
        formValid = false
        _formData.name = { ..._formData.name, error: 'Required!', focused: true }
      }
      if (!_formData.description.value) {
        formValid = false
        _formData.description = { ..._formData.description, error: 'Required!', focused: true }
      }
      if (!_formData.version.value) {
        formValid = false
        _formData.version = { ..._formData.version, error: 'Required!', focused: true }
      }

      /**
       * Validate export count by app plan
       * BASIC = 500
       * PRO = unlimited
       */
      if (props.storeSetting.appPlan === 'BASIC') {
        _formData.resources = _formData.resources.map((item) => {
          if ('count' in item) {
            if (item.count.value === 'all' || parseInt(item.count.value) > 500) {
              formValid = false
              errMsg = 'You can only export up to 500 items with BASIC plan.'
              return {
                ...item,
                count: {
                  ...item.count,
                  error: 'You can only export up to 500 items with BASIC plan.',
                },
              }
            }
          }
          return item
        })
      }

      if (!formValid) {
        setFormData(_formData)
        throw new Error(errMsg)
      }

      let _data = {
        name: _formData.name.value,
        description: _formData.description.value,
        version: _formData.version.value,
        resources: _formData.resources.map((item) => {
          let obj = {}
          Object.keys(item).forEach((key) =>
            item[key]?.value ? (obj[key] = item[key]?.value) : null
          )
          return obj
        }),
      }
      if (created.id) {
        _data.duplicatorPackageId = created.id
      }

      actions.showAppLoading()

      let res = await DuplicatorPackageApi.export(_data)
      if (!res.success) throw res.error

      actions.showNotify({ message: 'Process is running in background. Waiting for finnish.' })

      props.navigate('/background-jobs')
    } catch (error) {
      actions.showNotify({ error: true, message: error.message })
    } finally {
      actions.hideAppLoading()
    }
  }

  if (!formData) {
    return null
  }

  return (
    <Stack vertical>
      <SelectResources
        {...props}
        {...formData.resourceTypes}
        onChange={(value) => {
          let _formData = JSON.parse(JSON.stringify(formData))
          _formData.resourceTypes = { ...initFormData.resourceTypes }
          _formData.resources = []
          setFormData(_formData)
        }}
        onSubmit={(value) => {
          let _value = [...ValidResources]
            .map((item) => (value.includes(item) ? item : null))
            .filter((item) => item)

          let _formData = JSON.parse(JSON.stringify(formData))

          _formData.resourceTypes = { ..._formData.resourceTypes, value: _value, error: '' }

          if (_value.includes('theme')) {
            _formData.name.value = `${themes[0].name} theme`
            _formData.description.value = `${themes[0].name} theme`
            _formData.resources = _value.map((item) => ({
              ...ThemeResourceFormData,
              type: { ...ThemeResourceFormData.type, value: item },
              theme: {
                ...ThemeResourceFormData.theme,
                value: '' + themes[0].id,
                options: themes.map((_item) => ({
                  label: _item.name + `${_item.role === 'main' ? ' (Published)' : ''}`,
                  value: '' + _item.id,
                })),
              },
            }))
          } else {
            _formData.resources = _value.map((item) => ({
              ...CommonResourceFormData,
              type: { ...CommonResourceFormData.type, value: item },
            }))
          }

          setFormData(_formData)
        }}
      />

      {formData.resources.length > 0 && formData.resourceTypes.value[0] === 'theme' && (
        <Card title="Customize resources">
          <Card.Section subdued>
            <Card>
              <Card.Section title="Select a theme to export">
                <Stack distribution="fillEvenly">
                  <Stack.Item fill>
                    <FormControl
                      {...formData.resources[0].theme}
                      label=""
                      onChange={(value) => {
                        let theme = themes.find((item) => '' + item.id == '' + value)

                        let _formData = JSON.parse(JSON.stringify(formData))
                        _formData.resources[0].theme = {
                          ..._formData.resources[0].theme,
                          value,
                          error: '',
                        }
                        _formData.name = { ..._formData.name, value: `${theme.name} theme` }
                        _formData.description = {
                          ..._formData.description,
                          value: `${theme.name} theme`,
                        }
                        setFormData(_formData)
                      }}
                    />
                  </Stack.Item>
                  <Stack.Item fill></Stack.Item>
                </Stack>
              </Card.Section>
            </Card>
          </Card.Section>
        </Card>
      )}

      {formData.resources.length > 0 && formData.resourceTypes.value[0] !== 'theme' && (
        <Card title="Customize resources">
          <Card.Section subdued>
            <Stack vertical alignment="fill">
              {formData.resources.map((item, index) => (
                <ResourceItem
                  {...props}
                  key={index}
                  formData={item}
                  onChange={(data) => {
                    let _formData = JSON.parse(JSON.stringify(formData))
                    _formData.resources[index] = data
                    setFormData(_formData)
                  }}
                  resourceType={item.type.value}
                />
              ))}
            </Stack>
          </Card.Section>
        </Card>
      )}

      {/* {formData.resources.length && (
        <Card title="Optional">
          <Card.Section subdued>
            <Stack distribution="fillEvenly">
              <Stack.Item fill>
                <FormControl
                  {...formData['schedule']}
                  onChange={(value) => handleChange('schedule', value)}
                />
              </Stack.Item>
              <Stack.Item fill></Stack.Item>
            </Stack>
          </Card.Section>
        </Card>
      )} */}

      {formData.resources.length && (
        <Card title="Export information">
          <Card.Section subdued>
            <Stack distribution="fillEvenly">
              <Stack.Item fill>
                <FormControl
                  {...formData['name']}
                  onChange={(value) => handleChange('name', value)}
                />
              </Stack.Item>
              <Stack.Item fill>
                <FormControl
                  {...formData['description']}
                  onChange={(value) => handleChange('description', value)}
                />
              </Stack.Item>
            </Stack>
            <Stack distribution="fillEvenly">
              <Stack.Item fill>
                <FormControl
                  {...formData['version']}
                  onChange={(value) => handleChange('version', value)}
                />
              </Stack.Item>
              <Stack.Item fill></Stack.Item>
            </Stack>
          </Card.Section>
        </Card>
      )}

      {formData.resources.length && (
        <Stack distribution="trailing">
          <Button onClick={onDiscard} disabled={props.appLoading.loading}>
            <div style={{ minWidth: 80, textAlign: 'center' }}>Discard</div>
          </Button>
          <Button
            onClick={() => handleSubmit()}
            primary={!props.appLoading.loading}
            disabled={props.appLoading.loading}
          >
            <div style={{ minWidth: 80, textAlign: 'center' }}>Export now</div>
          </Button>
        </Stack>
      )}
    </Stack>
  )
}

export default CreateForm
