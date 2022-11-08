import { Badge, Button, Modal, Stack } from '@shopify/polaris'
import PropTypes from 'prop-types'
import formatDateTime from '../../helpers/formatDateTime'

PackageVersions.propTypes = {
  // ...appProps,
  selected: PropTypes.object,
  onClose: PropTypes.func,
  editable: PropTypes.bool,
  importable: PropTypes.bool,
  code: PropTypes.string,
}

PackageVersions.defaultProps = {
  selected: null,
  onClose: () => null,
  editable: true,
  importable: false,
  code: '',
}

const BadgeStatuses = {
  COMPLETED: 'success',
  PENDING: 'warning',
  RUNNING: 'info',
  FAILED: 'critical',
  CANCELED: 'attention',
}

function PackageVersions(props) {
  const { selected, onClose, editable, importable, code } = props

  return (
    <Modal
      large
      open={true}
      onClose={onClose}
      title="Package versions"
      secondaryActions={[
        {
          content: 'Close',
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9em' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f1f1' }}>
              <th style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>Advanced</th>
              <th style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>Result</th>
              <th style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selected.versions.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>
                  <Stack spacing="extraTight" alignment="baseline">
                    <div style={{ width: 80 }}>Name:</div>
                    <div>{item.name}</div>
                  </Stack>
                  <Stack spacing="extraTight" alignment="baseline" wrap={false}>
                    <div style={{ width: 80 }}>Description:</div>
                    <div>{item.description}</div>
                  </Stack>
                  <Stack spacing="extraTight" alignment="baseline" wrap={false}>
                    <div style={{ width: 80 }}>Version:</div>
                    <div>{item.version}</div>
                  </Stack>
                  <Stack spacing="extraTight" alignment="baseline" wrap={false}>
                    <div style={{ width: 80 }}>Status:</div>
                    <Badge status={BadgeStatuses[item.status]}>{item.status}</Badge>
                  </Stack>
                  <Stack spacing="extraTight" alignment="baseline" wrap={false}>
                    <div style={{ width: 80 }}>Message:</div>
                    <div>{item.message}</div>
                  </Stack>
                </td>
                <td
                  className={item.status === 'FAILED' ? 'color__error' : ''}
                  style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}
                >
                  <table
                    style={{
                      borderCollapse: 'collapse',
                      width: '100%',
                      fontSize: '0.9em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: '#f1f1f1' }}>
                        <th style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>Type</th>
                        <th style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>Columns</th>
                        <th style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>Filter</th>
                        <th style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>Count</th>
                        <th style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>
                          {selected.versions[0].resources[0].type === 'theme'
                            ? 'Total files'
                            : 'Total'}
                        </th>
                        <th style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>
                          {selected.versions[0].resources[0].type === 'theme'
                            ? 'Exported files'
                            : 'Exported'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.versions[index].resources.map((_item, _index) => (
                        <tr key={_index}>
                          <td style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>
                            {_item.type.replace(/_/g, ' ').toUpperCase()}S
                          </td>
                          <td style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>
                            {_item.columns?.length > 0 ? _item.columns?.length : 'all'} columns
                          </td>
                          <td style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>
                            {_item.filter ? 'filtered' : 'all resources'}
                          </td>
                          <td
                            style={{
                              border: '1px solid #dcdcdc',
                              padding: '0.5em',
                              textAlign: 'center',
                            }}
                          >
                            {_item.count || 'all'}
                          </td>
                          <td
                            style={{
                              border: '1px solid #dcdcdc',
                              padding: '0.5em',
                              textAlign: 'center',
                            }}
                          >
                            {selected.versions[index].result?.resources?.[_index]?.total || ''}
                          </td>
                          <td
                            style={{
                              border: '1px solid #dcdcdc',
                              padding: '0.5em',
                              textAlign: 'center',
                            }}
                          >
                            {selected.versions[index].result?.resources?.[_index]?.exported || ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td style={{ border: '1px solid #dcdcdc', padding: '0.5em' }}>
                  <Stack distribution="center" spacing="extraTight">
                    <Stack spacing="extraTight">
                      {editable && (
                        <Button
                          size="slim"
                          onClick={() => props.navigate(`/export/${selected.id}?v=${item.id}`)}
                        >
                          Edit
                        </Button>
                      )}
                      {importable && (
                        <Button
                          size="slim"
                          onClick={() =>
                            props.navigate(`/import/${selected.id}?v=${item.id}&c=${code}`)
                          }
                          disabled={item.status !== 'COMPLETED'}
                        >
                          Import
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Section>
    </Modal>
  )
}

export default PackageVersions
