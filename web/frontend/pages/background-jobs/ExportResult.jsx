import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Badge, Modal } from '@shopify/polaris'
import numberWithCommas from '../../helpers/numberWithCommas'

ExportResult.propTypes = {
  result: PropTypes.object,
  onClose: PropTypes.func,
}

ExportResult.defaultProps = {
  result: {},
  onClose: () => null,
}

function ExportResult(props) {
  const { result, onClose } = props

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Export result"
      secondaryActions={[
        {
          content: 'Close',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            fontSize: '0.9em',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f1f1f1', textTransform: 'uppercase' }}>
              <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>No.</th>
              <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Type</th>
              <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
                {result.resources[0].type === 'theme' ? 'Total files' : 'Total'}
              </th>
              <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
                {result.resources[0].type === 'theme' ? 'Exported files' : 'Exported'}
              </th>
              <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {result.resources.map((item, index) => (
              <tr key={index}>
                <td
                  style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em', textAlign: 'center' }}
                >
                  {index + 1}
                </td>
                <td style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
                  {item.type.replace(/_/g, ' ').toUpperCase()}S
                </td>
                <td
                  style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em', textAlign: 'center' }}
                >
                  {numberWithCommas(item.total)}
                </td>
                <td
                  style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em', textAlign: 'center' }}
                >
                  {numberWithCommas(item.exported)}
                </td>
                <th
                  style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em', textAlign: 'center' }}
                >
                  <Badge status="success">success</Badge>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Section>
    </Modal>
  )
}

export default ExportResult
