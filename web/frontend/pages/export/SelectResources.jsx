import PropTypes from 'prop-types'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DisplayText,
  Icon,
  OptionList,
  Stack,
} from '@shopify/polaris'
import { useState } from 'react'
import { useEffect } from 'react'
import { InfoMinor } from '@shopify/polaris-icons'

SelectResources.propTypes = {
  // ...appProps,
  value: PropTypes.array,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
}

SelectResources.defaultProps = {
  value: [],
  error: '',
  onChange: () => null,
  onSubmit: () => null,
}

const initOptions = {
  online_store: [
    'product',
    'custom_collection',
    'smart_collection',
    'customer',
    'page',
    'blog',
    'redirect',
    'metafield',
  ],
  theme: ['theme'],
  file: ['file'],
}

function SelectResources(props) {
  const { error, onChange, onSubmit } = props

  const [value, setValue] = useState([])

  useEffect(() => setValue(props.value), [])

  const handleChange = (_value) => {
    setValue(_value)
    onChange()
  }

  const handleSubmit = () => {
    onSubmit(value)
  }

  return (
    <Card title="Select resources">
      <Card.Section subdued>
        <Stack distribution="fillEvenly">
          <div>
            <div>
              <b>ONLINE STORE</b>
            </div>
            <OptionList
              selected={value}
              options={initOptions.online_store
                .map((item) => ({
                  label: item.replace(/_/g, ' ').toUpperCase() + 'S',
                  value: item,
                }))
                .map((item) => ({
                  ...item,
                  label:
                    item.label === 'BLOGS'
                      ? 'BLOG POSTS'
                      : item.label === 'METAFIELDS'
                      ? 'SHOP METAFIELDS'
                      : item.label,
                }))}
              onChange={(values) => {
                let _values = values.filter((item) => initOptions.online_store.includes(item))
                handleChange(_values)
              }}
              allowMultiple
            />
          </div>
          <div>
            <Stack spacing="tight">
              <div>
                <b>FILE</b>
              </div>
              <Badge status="info">PRO PLAN</Badge>
            </Stack>
            {props.storeSetting.appPlan === 'BASIC' ? (
              <div style={{ marginTop: '1em', marginLeft: '1em' }}>
                <Checkbox label="FILES" disabled />
              </div>
            ) : (
              <OptionList
                selected={value}
                options={initOptions.file.map((item) => ({
                  label: item.replace(/_/g, ' ').toUpperCase() + 'S',
                  value: item,
                }))}
                onChange={(values) => {
                  let _values = values.filter((item) => initOptions.file.includes(item))
                  handleChange(_values)
                }}
                allowMultiple
              />
            )}
          </div>
          <div>
            <Stack spacing="tight">
              <div>
                <b>THEME</b>
              </div>
              <Badge status="info">PRO PLAN</Badge>
            </Stack>
            {props.storeSetting.appPlan === 'BASIC' ? (
              <div style={{ marginTop: '1em', marginLeft: '1em' }}>
                <Checkbox label="THEME" disabled />
              </div>
            ) : (
              <OptionList
                selected={value}
                options={initOptions.theme.map((item) => ({
                  label: item.replace(/_/g, ' ').toUpperCase(),
                  value: item,
                }))}
                onChange={(values) => {
                  let _values = values.filter((item) => initOptions.theme.includes(item))
                  handleChange(_values)
                }}
                allowMultiple
              />
            )}
          </div>
        </Stack>
      </Card.Section>
      <Card.Section>
        <Stack distribution="equalSpacing">
          <Stack.Item>
            <div className={Boolean(error) ? 'color__error' : 'color__note'}>
              <Stack spacing="extraTight" alignment="center">
                <Icon source={InfoMinor} />
                <div>
                  {Boolean(error)
                    ? error
                    : 'Select resources then click "Continue" button to customize resources'}
                </div>
              </Stack>
            </div>
          </Stack.Item>
          <Button
            onClick={handleSubmit}
            primary={value.length > 0 && JSON.stringify(value) !== JSON.stringify(props.value)}
            disabled={
              !Boolean(value.length > 0 && JSON.stringify(value) !== JSON.stringify(props.value))
            }
          >
            Continue
          </Button>
        </Stack>
      </Card.Section>
    </Card>
  )
}

export default SelectResources
