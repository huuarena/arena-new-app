import React, { useState } from 'react'
import { Badge, Card, Modal, Stack, Tabs } from '@shopify/polaris'
import numberWithCommas from '../../helpers/numberWithCommas'

function ImportResult(props) {
  const { result, onClose } = props

  const [selected, setSelected] = useState(0)

  const tabs = result.map((item) => ({
    id: item.type,
    panelID: item.type,
    content: item.type.replace(/_/g, ' ').toUpperCase() + 'S',
    accessibilityLabel: item.type.replace(/_/g, ' ').toUpperCase() + 'S',
  }))

  const renderDetails = () => {
    switch (result[0].type) {
      case 'theme':
        return (
          <Stack vertical>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9em' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f1f1', textTransform: 'uppercase' }}>
                  <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>No.</th>
                  <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>ID</th>
                  <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Name</th>
                  <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Role</th>
                  <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Status</th>
                  <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Message</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      border: '1px solid #dcdcdc',
                      padding: '0.5em 1em',
                      textAlign: 'center',
                    }}
                  >
                    1
                  </td>
                  <td style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
                    {result[selected].theme.id}
                  </td>
                  <td style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
                    {result[selected].theme.name}
                  </td>
                  <td style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
                    {result[selected].theme.role}
                  </td>
                  <td
                    style={{
                      border: '1px solid #dcdcdc',
                      padding: '0.5em 1em',
                      textAlign: 'center',
                    }}
                  >
                    <Badge status="success">success</Badge>
                  </td>
                  <td
                    style={{
                      border: '1px solid #dcdcdc',
                      padding: '0.5em 1em',
                      textAlign: 'center',
                    }}
                  ></td>
                </tr>
              </tbody>
            </table>
          </Stack>
        )
        break

      default:
        return (
          <Stack vertical>
            <Stack spacing="extraLoose">
              <div>Total: {numberWithCommas(result[selected].result.length)}</div>
              <div className="color__success">
                Success:{' '}
                {numberWithCommas(result[selected].result.filter((item) => item.success).length)}
              </div>
              <div className="color__error">
                Failed:{' '}
                {numberWithCommas(result[selected].result.filter((item) => !item.success).length)}
              </div>
            </Stack>

            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9em' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f1f1', textTransform: 'uppercase' }}>
                  <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>No.</th>
                  <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>ID</th>
                  <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Handle</th>
                  <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Status</th>
                  <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {result[selected].result.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        border: '1px solid #dcdcdc',
                        padding: '0.5em 1em',
                        textAlign: 'center',
                      }}
                    >
                      {index + 1}
                    </td>
                    <td style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>{item.id}</td>
                    <td style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
                      {item.handle}
                    </td>
                    <td
                      style={{
                        border: '1px solid #dcdcdc',
                        padding: '0.5em 1em',
                        textAlign: 'center',
                      }}
                    >
                      <Badge status={item.success ? 'success' : 'critical'}>
                        {item.success ? 'success' : 'failed'}
                      </Badge>
                    </td>
                    <td
                      style={{
                        border: '1px solid #dcdcdc',
                        padding: '0.5em 1em',
                        textAlign: 'center',
                      }}
                    >
                      {item.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Stack>
        )
        break
    }
  }

  return (
    <Modal
      large
      open={true}
      onClose={onClose}
      title="Import result"
      secondaryActions={[
        {
          content: 'Close',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section subdued>
        <Card>
          <Tabs tabs={tabs} selected={selected} onSelect={setSelected} fitted>
            <Card.Section>{renderDetails()}</Card.Section>
          </Tabs>
        </Card>
      </Modal.Section>
    </Modal>
  )
}

export default ImportResult
