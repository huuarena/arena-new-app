import { Button, Card, Checkbox, RadioButton, Stack, TextField } from '@shopify/polaris'
import React, { useState } from 'react'
import { useEffect } from 'react'
import DuplicatorPackageApi from '../../apis/duplicator_package'
import ImportTheme from './ImportTheme'

const initFormData = {
  resources: { value: [], error: '' },
  themeId: { value: '', error: '' },
  themeType: { value: 'create', error: '' },
  themeName: { value: '', error: '' },
  themeRole: { value: '', error: '' },
}

function CreateForm(props) {
  const { actions, created, onDiscard, version, code } = props

  const importType = version.resources.map((item) => item.type).includes('theme') ? 'theme' : ''

  const [formData, setFormData] = useState(initFormData)

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }

    switch (name) {
      case 'themeType':
        _formData['themeId'] = {
          ..._formData['themeId'],
          value: value === 'updated' ? '' + themes[0].id : '',
          error: '',
        }
        _formData['themeName'] = {
          ..._formData['themeName'],
          value:
            value === 'create'
              ? `${
                  version.result.resources?.[0]?.theme?.name
                } duplicate - ${new Date().toUTCString()}`
              : '',
          error: '',
        }
        break

      default:
        break
    }

    setFormData(_formData)
  }

  useEffect(() => {
    handleChange(
      'resources',
      version.resources.map((item) => item.type)
    )
  }, [])

  const handleSubmit = async () => {
    try {
      actions.showAppLoading()

      let data = {
        code,
        duplicatorPackageId: created.id,
        versionId: version.id,
        resources: formData['resources'].value,
      }

      if (importType === 'theme') {
        if (formData['themeName'].value) {
          data.themeName = formData['themeName'].value
        } else {
          data.themeId = formData['themeId'].value
        }
      }

      let res = await DuplicatorPackageApi.import(data)
      if (!res.success) throw res.error

      actions.showNotify({ message: 'Process is running in background. Waiting for finnish.' })

      props.navigate('/background-jobs')
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  if (!formData) return null

  return (
    <Stack vertical alignment="fill">
      <Stack distribution="fillEvenly">
        <Stack.Item fill>
          <Card title="Package name">
            <Card.Section subdued>
              <Stack vertical spacing="extraTight">
                <Stack alignment="baseline" spacing="tight">
                  <div style={{ minWidth: 60 }}>Name</div>
                  <div>:</div>
                  <div>{created.name}</div>
                </Stack>
                <Stack alignment="baseline" spacing="tight">
                  <div style={{ minWidth: 60 }}>Description</div>
                  <div>:</div>
                  <div>{created.description}</div>
                </Stack>
              </Stack>
            </Card.Section>
          </Card>
        </Stack.Item>
        <Stack.Item fill>
          <Card title="Version name">
            <Card.Section subdued>
              <Stack vertical spacing="extraTight">
                <Stack alignment="baseline" spacing="tight">
                  <div style={{ minWidth: 60 }}>Name</div>
                  <div>:</div>
                  <div>{version.name}</div>
                </Stack>
                <Stack alignment="baseline" spacing="tight">
                  <div style={{ minWidth: 60 }}>Description</div>
                  <div>:</div>
                  <div>{version.description}</div>
                </Stack>
              </Stack>
            </Card.Section>
          </Card>
        </Stack.Item>
      </Stack>

      <Card title="Export resources">
        <Card.Section subdued>
          <div className="table-block table-block__white">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Type</th>
                  <th>Columns</th>
                  <th>Filter</th>
                  <th>Count</th>
                  <th>{version.resources[0].type === 'theme' ? 'Total files' : 'Total'}</th>
                  <th>{version.resources[0].type === 'theme' ? 'Exported files' : 'Exported'}</th>
                </tr>
              </thead>
              <tbody>
                {version.resources.map((item, index) => (
                  <tr
                    key={index}
                    className={formData['resources'].value.includes(item.type) ? '' : 'color__note'}
                  >
                    <td className="center-align">
                      <Checkbox
                        checked={formData['resources'].value.includes(item.type)}
                        onChange={() => {
                          let _formData = JSON.parse(JSON.stringify(formData))
                          if (_formData['resources'].value.find((_item) => _item === item.type)) {
                            _formData['resources'].value = _formData['resources'].value.filter(
                              (_item) => _item !== item.type
                            )
                          } else {
                            _formData['resources'].value.push(item.type)
                          }
                          setFormData(_formData)
                        }}
                        disabled={Boolean(formData['resources'].value.length <= 1)}
                      />
                    </td>
                    <td>
                      {item.type.toUpperCase() === 'METAFIELD'
                        ? 'SHOP METAFIELD'
                        : item.type.toUpperCase().replace(/_/g, ' ')}
                      S
                    </td>
                    <td>{item.columns?.length > 0 ? item.columns?.length : 'all'} columns</td>
                    <td>{item.filter ? 'filtered' : 'all resources'}</td>
                    <td className="center-align">{item.count || 'all'}</td>
                    <td className="center-align">
                      {version.result?.resources?.[index]?.total || ''}
                    </td>
                    <td className="center-align">
                      {version.result?.resources?.[index]?.exported || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Section>
      </Card>

      {importType === 'theme' && (
        <ImportTheme {...props} formData={formData} onChange={handleChange} />
      )}

      <Stack distribution="trailing">
        <Button onClick={onDiscard}>Discard</Button>
        <Button
          onClick={handleSubmit}
          primary={!Boolean(props.appLoading.loading)}
          disabled={Boolean(props.appLoading.loading)}
        >
          Import now
        </Button>
      </Stack>
    </Stack>
  )
}

export default CreateForm
