import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Card, Modal, Pagination, ResourceItem, ResourceList, Stack, TextStyle } from '@shopify/polaris'

Faqs.propTypes = {
  items: PropTypes.array,
  limit: PropTypes.number,
}

Faqs.defaultProps = {
  items: [],
  limit: 10,
}

function Faqs(props) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(props.limit)
  const [selected, setSelected] = useState(null)

  const totalItems = props.items.length
  const totalPages = Math.ceil(totalItems / limit)

  const items = props.items.slice((page - 1) * limit, page * limit)

  return (
    <Stack vertical>
      <Card>
        <ResourceList
          resourceName={{ singular: 'faq', plural: 'faqs' }}
          items={items}
          renderItem={(item) => (
            <ResourceItem id={item.id} accessibilityLabel={item.attributes.title} onClick={() => setSelected(item)}>
              <h3>
                <TextStyle variation="strong">{item.attributes.title}</TextStyle>
              </h3>
            </ResourceItem>
          )}
        />
      </Card>

      {totalPages > limit && (
        <Stack distribution="center">
          <Pagination
            label={`${page} of ${totalPages}`}
            hasPrevious={page > 1}
            onPrevious={() => setPage(page - 1)}
            hasNext={page < totalPages}
            onNext={() => setPage(page + 1)}
          />
        </Stack>
      )}

      {selected && (
        <Modal
          large
          open={true}
          onClose={() => setSelected(null)}
          title={selected.attributes.title}
          secondaryActions={[
            {
              content: 'Close',
              onAction: () => setSelected(null),
            },
          ]}
        >
          <Modal.Section subdued>
            <div className="faq">
              <div
                dangerouslySetInnerHTML={{
                  __html: selected.attributes.body_html || '',
                }}
              />
            </div>
          </Modal.Section>
        </Modal>
      )}
    </Stack>
  )
}

export default Faqs
