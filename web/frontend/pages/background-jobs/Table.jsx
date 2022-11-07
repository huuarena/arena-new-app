import PropTypes from 'prop-types'
import { Badge, Button, DataTable, Stack } from '@shopify/polaris'
import { useState } from 'react'
import formatDateTime from '../../helpers/formatDateTime'
import ExportResult from './ExportResult'
import ImportResult from './ImportResult'

Table.propTypes = {
  // ...appProps,
  items: PropTypes.array,
}

Table.defaultProps = {
  items: null,
}

const Types = {
  duplicator_export: 'EXPORT',
  duplicator_import: 'IMPORT',
}

const BadgeStatuses = {
  COMPLETED: 'success',
  PENDING: 'warning',
  RUNNING: 'info',
  FAILED: 'critical',
  CANCELED: 'attention',
}

function Table(props) {
  const { items } = props

  const [exported, setExported] = useState(null)
  const [imported, setImported] = useState(null)

  const [selected, setSelected] = useState(null)

  const styles = {
    label: {
      minWidth: 140,
    },
    content: {
      whiteSpace: 'normal',
    },
  }

  let rows = []
  if (items?.length > 0) {
    rows = items.map((item, index) => [
      index + 1,
      <b>{Types[item.type]}</b>,
      <Badge status={BadgeStatuses[item.status]}>
        {item.status}
        {item.status === 'RUNNING' && item.progress !== 0 && item.progress !== 100 ? ` ${item.progress}%` : ``}
      </Badge>,
      <Stack vertical spacing="extraTight">
        {Boolean(item.data?.name) && (
          <Stack spacing="tight" alignment="baseline" wrap={false}>
            <div style={styles.label}>Package name</div>
            <div>:</div>
            <div style={styles.content}>{item.data?.name}</div>
          </Stack>
        )}
        {Boolean(item.data?.description) && (
          <Stack spacing="tight" alignment="baseline" wrap={false}>
            <div style={styles.label}>Package description</div>
            <div>:</div>
            <div style={styles.content}>{item.data?.description}</div>
          </Stack>
        )}
        {Boolean(item.data?.version) && (
          <Stack spacing="tight" alignment="baseline" wrap={false}>
            <div style={styles.label}>Package version</div>
            <div>:</div>
            <div style={styles.content}>{String(item.data?.version)}</div>
          </Stack>
        )}
        {Boolean(item.type === 'duplicator_export') && (
          <Stack spacing="tight" alignment="baseline" wrap={false}>
            <div style={styles.label}>Result</div>
            <div>:</div>
            <Button
              plain
              onClick={() => setExported(item)}
              disabled={!Boolean(item.result && item.status === 'COMPLETED')}
            >
              Show result
            </Button>
          </Stack>
        )}
        {Boolean(item.type === 'duplicator_import') && (
          <Stack spacing="tight" alignment="baseline" wrap={false}>
            <div style={styles.label}>Result</div>
            <div>:</div>
            <Button
              plain
              onClick={() => setImported(item)}
              disabled={!Boolean(item.result && item.status === 'COMPLETED')}
            >
              Show result
            </Button>
          </Stack>
        )}
        <Stack spacing="tight" alignment="baseline" wrap={false}>
          <div style={styles.label}>Message</div>
          <div>:</div>
          <div style={styles.content} className={item.status === 'FAILED' ? 'color__error' : ''}>
            {item.message}
          </div>
        </Stack>
        <Stack spacing="tight" alignment="baseline" wrap={false}>
          <div style={styles.label}>Updated At</div>
          <div>:</div>
          <div style={styles.content}>{formatDateTime(new Date(item.updatedAt), 'LLL')}</div>
        </Stack>
      </Stack>,
    ])
  }

  return (
    <>
      <DataTable
        headings={['No.', 'Type', 'Status', 'Advanced']}
        columnContentTypes={['text', 'text', 'text', 'text']}
        rows={rows}
        footerContent={items ? (items.length > 0 ? undefined : 'Have no data') : 'loading..'}
      />

      {exported && <ExportResult result={exported.result} onClose={() => setExported(null)} />}
      {imported && <ImportResult result={imported.result} onClose={() => setImported(null)} />}
    </>
  )
}

export default Table
