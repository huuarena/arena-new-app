import { Button, Card, Collapsible, Icon, Stack, Tag } from '@shopify/polaris'
import { useState } from 'react'
import FormControl from '../../components/FormControl'
import { ChevronLeftMinor, ChevronDownMinor, FilterMajor, InfoMinor } from '@shopify/polaris-icons'
import {
  convertDataToFormData,
  convertFormDataToData,
  generateConditionFormData,
  generateFilterString,
} from '../../components/Condition/actions'
import Condition from '../../components/Condition'
import SelectColumns from './SelectColumns'

function ResourceItem(props) {
  const { actions, formData, onChange, resourceType } = props

  const [open, setOpen] = useState(false)
  const [openFilter, setOpenFilter] = useState(false)
  const [openSelectColumns, setOpenSelectColumns] = useState(false)

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    onChange(_formData)
  }

  const renderSelectColumns = () => {
    switch (resourceType) {
      case 'file':
        return <Card.Section title="Select columns (All columns)"></Card.Section>
        break

      default:
        return (
          <Card.Section
            title={`Select columns (${
              formData.columns?.value?.length > 0 ? formData.columns.value.length : 'all'
            } columns)`}
          >
            <Button onClick={() => setOpenSelectColumns(!openSelectColumns)}>Select columns</Button>
            {openSelectColumns && (
              <SelectColumns
                resourceType={resourceType}
                columns={formData['columns'].value}
                onDiscard={() => {
                  setOpenSelectColumns(false)
                }}
                onSubmit={(value) => {
                  handleChange('columns', value)
                  setOpenSelectColumns(false)
                }}
              />
            )}
          </Card.Section>
        )
        break
    }
  }

  const renderFilterResources = () => {
    switch (resourceType) {
      case 'file':
        return (
          <Card.Section title="Filter resources">
            <Stack distribution="fillEvenly">
              <Stack.Item fill>
                <div className="color__note">
                  <Stack alignment="center" spacing="extraTight">
                    <Icon source={InfoMinor}></Icon>
                    <div>Export files will ignore all files with VIDEO extension.</div>
                  </Stack>
                </div>
              </Stack.Item>
              <Stack.Item fill></Stack.Item>
            </Stack>
          </Card.Section>
        )
        break

      case 'redirect':
        return null
        break

      default:
        return (
          <Card.Section
            title={`Filter resources${formData.filter?.value === null ? ' (all resources)' : ''}`}
          >
            <Stack distribution="fillEvenly">
              <Stack.Item fill>
                <Stack vertical>
                  <Button
                    icon={FilterMajor}
                    onClick={() => {
                      handleChange(
                        'filter',
                        formData['filter'].value
                          ? convertDataToFormData(formData['filter'].value, resourceType)
                          : generateConditionFormData(resourceType)
                      )
                      setOpenFilter(true)
                    }}
                  >
                    Filter
                  </Button>
                  {Boolean(formData['filter'].value) && (
                    <Stack.Item>
                      <Tag onRemove={() => handleChange('filter', null)}>
                        {generateFilterString(formData['filter'].value)}
                      </Tag>
                    </Stack.Item>
                  )}
                  {openFilter && formData['filter'].value && (
                    <Condition
                      formData={formData['filter'].value}
                      onDiscard={() => {
                        handleChange('filter', convertFormDataToData(formData['filter'].value))
                        setOpenFilter(false)
                      }}
                      onSubmit={(data) => {
                        generateFilterString(data)
                        handleChange('filter', convertFormDataToData(data))
                        setOpenFilter(false)
                      }}
                      resourceType={resourceType}
                    />
                  )}
                </Stack>
              </Stack.Item>
              <Stack.Item fill></Stack.Item>
            </Stack>
          </Card.Section>
        )
        break
    }
  }

  return (
    <Card>
      <Card.Section>
        <div
          style={{ padding: '1em', margin: '-1em', cursor: 'pointer' }}
          onClick={() => setOpen(!open)}
        >
          <Stack distribution="equalSpacing" alignment="center">
            <div style={{ textTransform: 'uppercase', fontWeight: 600 }}>
              {formData.type.value.replace(/_/g, ' ').toUpperCase() + 'S' === 'BLOGS'
                ? 'BLOG POSTS'
                : formData.type.value.replace(/_/g, ' ').toUpperCase() + 'S' === 'METAFIELDS'
                ? 'SHOP METAFIELDS'
                : formData.type.value.replace(/_/g, ' ').toUpperCase() + 'S'}
            </div>
            <Icon source={open ? ChevronDownMinor : ChevronLeftMinor} />
          </Stack>
        </div>
      </Card.Section>
      <Collapsible
        open={open}
        id="basic-collapsible"
        transition={{ duration: '100ms', timingFunction: 'ease-in-out' }}
        expandOnPrint
      >
        <Card.Section subdued>
          <Card>
            {renderSelectColumns()}

            {renderFilterResources()}

            <Card.Section title="Select export count">
              <Stack distribution="fillEvenly">
                <Stack.Item fill>
                  <FormControl
                    {...formData['count']}
                    label=""
                    onChange={(value) => handleChange('count', value)}
                  />
                </Stack.Item>
                <Stack.Item fill></Stack.Item>
              </Stack>
            </Card.Section>
          </Card>
        </Card.Section>
      </Collapsible>
    </Card>
  )
}

export default ResourceItem
