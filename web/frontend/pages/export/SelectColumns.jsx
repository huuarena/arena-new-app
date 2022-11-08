import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { ExportColumns } from './constants'
import { Button, Card, Checkbox, Collapsible, Icon, Modal, Stack } from '@shopify/polaris'
import { ChevronLeftMinor, ChevronDownMinor } from '@shopify/polaris-icons'

SelectColumns.propTypes = {
  // ...appProps,
  resourceType: PropTypes.string,
  columns: PropTypes.any,
  onDiscard: PropTypes.func,
  onSubmit: PropTypes.func,
}

SelectColumns.defaultProps = {
  // ...appProps,
  resourceType: '',
  columns: null,
  onDiscard: () => null,
  onSubmit: () => null,
}

function SelectColumns(props) {
  const { resourceType, onDiscard, onSubmit } = props

  const [columns, setColumns] = useState(null)
  const [collapseSelected, setCollapseSelected] = useState('')

  const [resourceTypeSelected, setResourceTypeSelected] = useState('')

  useEffect(() => {
    if (props.columns) {
      setColumns(props.columns)
    } else {
      setColumns(ExportColumns[resourceType])
    }
  }, [])

  if (!columns) {
    return null
  }

  const handleSubmit = () => {
    if (columns.length === 0 || columns.length === ExportColumns[resourceType].length) {
      onSubmit(null)
    } else {
      onSubmit(columns)
    }
  }

  let ResouceColumns = {
    default: columns.filter(
      (item) =>
        !item.startsWith('metafield_') &&
        !item.startsWith('variant_') &&
        !item.startsWith('image_') &&
        !item.startsWith('article_') &&
        !item.startsWith('address_')
    ),
    metafield: columns.filter((item) => item.startsWith('metafield_')),
    variant_metafield: columns.filter((item) => item.startsWith('variant_metafield_')),
    variant: columns.filter(
      (item) => item.startsWith('variant_') && !item.startsWith('variant_metafield_')
    ),
    image_metafield: columns.filter((item) => item.startsWith('image_metafield_')),
    image: columns.filter(
      (item) => item.startsWith('image_') && !item.startsWith('image_metafield_')
    ),
    article_metafield: columns.filter((item) => item.startsWith('article_metafield_')),
    article_image: columns.filter((item) => item.startsWith('article_image_')),
    article: columns.filter(
      (item) =>
        item.startsWith('article_') &&
        !item.startsWith('article_metafield_') &&
        !item.startsWith('article_image')
    ),
    address: columns.filter((item) => item.startsWith('address_')),
  }

  const renderSection = (type) => {
    let sampleColumns = []
    switch (type) {
      case 'metafield':
        sampleColumns = ExportColumns[resourceType].filter((item) => item.startsWith('metafield_'))
        break

      case 'variant_metafield':
        sampleColumns = ExportColumns[resourceType].filter((item) =>
          item.startsWith('variant_metafield_')
        )
        break

      case 'variant':
        sampleColumns = ExportColumns[resourceType].filter(
          (item) => item.startsWith('variant_') && !item.startsWith('variant_metafield_')
        )
        break

      case 'image_metafield':
        sampleColumns = ExportColumns[resourceType].filter((item) =>
          item.startsWith('image_metafield_')
        )
        break

      case 'image':
        sampleColumns = ExportColumns[resourceType].filter(
          (item) => item.startsWith('image_') && !item.startsWith('image_metafield_')
        )
        break

      case 'article_image':
        sampleColumns = ExportColumns[resourceType].filter((item) =>
          item.startsWith('article_image_')
        )
        break

      case 'article_metafield':
        sampleColumns = ExportColumns[resourceType].filter((item) =>
          item.startsWith('article_metafield_')
        )
        break

      case 'article':
        sampleColumns = ExportColumns[resourceType].filter(
          (item) =>
            item.startsWith('article_') &&
            !item.startsWith('article_metafield_') &&
            !item.startsWith('article_image_')
        )
        break

      case 'address':
        sampleColumns = ExportColumns[resourceType].filter((item) => item.startsWith('address_'))
        break

      default:
        // default
        sampleColumns = ExportColumns[resourceType].filter(
          (item) =>
            !item.startsWith('metafield_') &&
            !item.startsWith('variant_') &&
            !item.startsWith('image_') &&
            !item.startsWith('article_') &&
            !item.startsWith('address_')
        )
        break
    }

    let title = type === 'default' ? resourceType : type
    title = title[0].toUpperCase() + title.slice(1).replace(/_/g, ' ').toLowerCase()

    return (
      <Card.Section>
        <div
          style={{ padding: '1em', margin: '-1em', cursor: 'pointer' }}
          onClick={() => setCollapseSelected(collapseSelected === type ? '' : type)}
        >
          <Stack distribution="equalSpacing" alignment="center">
            <div style={{ textTransform: 'uppercase', fontWeight: 600 }}>{title}</div>
            <Icon source={collapseSelected === type ? ChevronDownMinor : ChevronLeftMinor} />
          </Stack>
        </div>
        <Collapsible
          open={collapseSelected === type}
          id={`${type}-collapsible`}
          transition={{ duration: '200ms', timingFunction: 'ease-in-out' }}
          expandOnPrint
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1em' }}>
            {sampleColumns.map((item, index) => (
              <div style={{ width: '50%' }}>
                <Checkbox
                  label={
                    item.replace(/_/g, ' ')[0].toUpperCase() + item.replace(/_/g, ' ').slice(1)
                  }
                  checked={ResouceColumns[type].includes(item)}
                  onChange={() => {
                    let _columns = columns.includes(item)
                      ? columns.filter((_item) => _item !== item)
                      : [...columns, item]
                    setColumns(_columns)
                  }}
                />
              </div>
            ))}
          </div>
        </Collapsible>
      </Card.Section>
    )
  }

  return (
    <Modal
      open={true}
      onClose={onDiscard}
      title="Select export columns"
      primaryAction={{
        content: 'Submit',
        onAction: handleSubmit,
      }}
      secondaryActions={[
        {
          content: 'Discard',
          onAction: onDiscard,
        },
      ]}
    >
      <Modal.Section>
        <Card>
          {renderSection('default')}
          {Boolean(ExportColumns[resourceType].find((item) => item.includes('address_'))) &&
            renderSection('address')}
          {Boolean(ExportColumns[resourceType].find((item) => item.includes('metafield_'))) &&
            renderSection('metafield')}
          {Boolean(ExportColumns[resourceType].find((item) => item.includes('variant_'))) &&
            renderSection('variant')}
          {Boolean(
            ExportColumns[resourceType].find((item) => item.includes('variant_metafield_'))
          ) && renderSection('variant_metafield')}
          {Boolean(ExportColumns[resourceType].find((item) => item.includes('image_'))) &&
            renderSection('image')}
          {Boolean(ExportColumns[resourceType].find((item) => item.includes('image_metafield_'))) &&
            renderSection('image_metafield')}
          {Boolean(ExportColumns[resourceType].find((item) => item.includes('article_'))) &&
            renderSection('article')}
          {Boolean(
            ExportColumns[resourceType].find((item) => item.includes('article_metafield_'))
          ) && renderSection('article_metafield')}
          {Boolean(ExportColumns[resourceType].find((item) => item.includes('article_image_'))) &&
            renderSection('article_image')}
        </Card>
      </Modal.Section>
    </Modal>
  )
}

export default SelectColumns
