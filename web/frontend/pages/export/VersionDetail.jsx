import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Stack } from '@shopify/polaris'
import formatDateTime from '../../helpers/formatDateTime'
import { generateFilterString } from '../../components/Condition/actions'

VersionDetail.propTypes = {
  version: PropTypes.object,
}

const BadgeStatuses = {
  COMPLETED: 'success',
  PENDING: 'warning',
  RUNNING: 'info',
  FAILED: 'critical',
  CANCELED: 'attention',
}

function VersionDetail(props) {
  const { version } = props

  if (!version) {
    return (
      <Stack distribution="center">
        <div style={{ textAlign: 'center' }}>Have no package version available</div>
      </Stack>
    )
  }

  return (
    <Stack vertical alignment="fill">
      <Stack vertical alignment="fill" spacing="extraTight">
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
          <div style={{ minWidth: 90 }}>Version</div>
          <div>:</div>
          <div style={{ maxWidth: 300 }}>{version.version}</div>
        </Stack>

        <Stack spacing="tight" wrap={false}>
          <div style={{ minWidth: 90 }}>Status</div>
          <div>:</div>
          <div>
            <Badge status={BadgeStatuses[version.status]}>{version.status}</Badge>
          </div>
        </Stack>

        <Stack spacing="tight" wrap={false}>
          <div style={{ minWidth: 90 }}>Message</div>
          <div>:</div>
          <div className={version.status === 'FAILED' ? 'color__error' : ''}>{version.message}</div>
        </Stack>

        <Stack spacing="tight" wrap={false}>
          <div style={{ minWidth: 90 }}>Last updated</div>
          <div>:</div>
          <div>{formatDateTime(version.updatedAt, 'LLL')}</div>
        </Stack>
      </Stack>

      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9em' }}>
        <thead style={{ backgroundColor: '#f1f1f1' }}>
          <tr>
            <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Resource</th>
            <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Columns</th>
            <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Filters</th>
            <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>Count</th>
            <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
              {version.resources[0].type === 'theme' ? 'Total files' : 'Total'}
            </th>
            <th style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
              {version.resources[0].type === 'theme' ? 'Exported files' : 'Exported'}
            </th>
          </tr>
        </thead>
        <tbody>
          {version.resources.map((item, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #dcdcdc', padding: '0.5em 1em' }}>
                {item.type.replace(/_/g, ' ').toUpperCase()}S
              </td>
              <td
                style={{
                  border: '1px solid #dcdcdc',
                  padding: '0.5em 1em',
                  textAlign: 'center',
                }}
              >
                {item.columns?.length > 0 ? item.columns.length : 'all'} columns
              </td>
              <td
                style={{
                  border: '1px solid #dcdcdc',
                  padding: '0.5em 1em',
                  textAlign: 'center',
                }}
              >
                {item.filter ? generateFilterString(item.filter) : 'all resources'}
              </td>
              <td
                style={{
                  border: '1px solid #dcdcdc',
                  padding: '0.5em 1em',
                  textAlign: 'center',
                }}
              >
                {item.count}
              </td>
              <td
                style={{
                  border: '1px solid #dcdcdc',
                  padding: '0.5em 1em',
                  textAlign: 'center',
                }}
              >
                {version.result?.resources?.[index]?.total || 0}
              </td>
              <td
                style={{
                  border: '1px solid #dcdcdc',
                  padding: '0.5em 1em',
                  textAlign: 'center',
                }}
              >
                {version.result?.resources?.[index]?.exported || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Stack>
  )
}

export default VersionDetail
