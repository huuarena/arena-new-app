import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { ActionList, Badge, Button, DataTable, Popover, Stack } from '@shopify/polaris'
import formatDateTime from '../../helpers/formatDateTime'
import { MobileVerticalDotsMajor } from '@shopify/polaris-icons'
import ConfirmModal from '../../components/ConfirmModal'
import PackageVersions from './PackageVersions'

Table.propTypes = {
  // ...appProps,
  items: PropTypes.array,
  onActive: PropTypes.func,
  onDelete: PropTypes.func,
  editable: PropTypes.bool,
  importable: PropTypes.bool,
  code: PropTypes.string,
}

Table.defaultProps = {
  items: null,
  onActive: () => null,
  onDelete: () => null,
  editable: true,
  importable: true,
  code: '',
}

const BadgeStatuses = {
  ACTIVE: 'success',
  ARCHIVED: '',
  COMPLETED: 'success',
  PENDING: 'warning',
  RUNNING: 'info',
  FAILED: 'critical',
  CANCELED: 'attention',
}

const getStatus = (item) => {
  if (item.status !== 'ACTIVE') {
    return item.status
  }

  let statuses = item.versions.map((item) => item.status)

  if (statuses.includes('COMPLETED')) {
    return 'ACTIVE'
  }

  return statuses[0]
}

function Table(props) {
  const { actions, items, onActive, onDelete, editable, importable, code } = props

  const [selected, setSelected] = useState(null)
  const [archived, setArchived] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [edited, setEdited] = useState(null)

  const renderActionList = (item) => {
    let actionList = []

    if (editable) {
      actionList.push({
        content: 'Edit',
        onAction: () => setEdited(item) & setSelected(null),
      })
      actionList.push({
        content: item.status === 'ACTIVE' ? 'Move to Archived' : 'Move to Active',
        onAction: () => setArchived(item) & setSelected(null),
      })
      actionList.push({
        content: 'Delete',
        onAction: () => setDeleted(item) & setSelected(null),
        disabled: item.status === 'ACTIVE',
      })
    }

    if (importable) {
      actionList.push({
        content: 'Import',
        onAction: () => setEdited(item) & setSelected(null),
        disabled: getStatus(item) !== 'ACTIVE',
      })
    }

    return actionList
  }

  let rows = []
  if (items?.length) {
    rows = items.map((item, index) => {
      return [
        index + 1,
        <div style={{ maxWidth: 240, whiteSpace: 'normal' }}>
          <p>
            <b>{item.name}</b>
          </p>
          <p>{item.description}</p>
        </div>,
        <Badge status={BadgeStatuses[getStatus(item)]}>{getStatus(item)}</Badge>,
        <Button plain onClick={() => setEdited(item)}>
          {item.versions.length}
          {item.versions.length > 1 ? ' versions' : ' version'}
        </Button>,
        <div>{formatDateTime(item.updatedAt, 'LLL')}</div>,
        <Popover
          active={item.id === selected?.id}
          activator={
            <Button
              plain
              onClick={() => setSelected(selected?.id === item.id ? null : item)}
              icon={MobileVerticalDotsMajor}
            />
          }
          onClose={() => setSelected(null)}
        >
          <ActionList actionRole="menuitem" items={renderActionList(item)} />
        </Popover>,
      ]
    })
  }

  return (
    <div>
      <DataTable
        headings={['No.', 'Package Name', 'Status', 'Package Versions', 'Last Updated', 'Action']}
        columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text', 'text']}
        rows={rows}
        footerContent={items ? (items.length > 0 ? undefined : 'Have no data') : 'loading..'}
      />

      {archived && (
        <ConfirmModal
          title={`${archived.status === 'ACTIVE' ? 'Archive' : 'Active'} confirmation`}
          content={`Are you sure want to ${
            archived.status === 'ACTIVE' ? 'archive' : 'active'
          } the package. This can be undone.`}
          onClose={() => setArchived(null)}
          secondaryActions={[
            {
              content: 'Discard',
              onAction: () => setArchived(null),
            },
            {
              content: `${archived.status === 'ACTIVE' ? 'Archive' : 'Active'} now`,
              onAction: () => onActive(archived) & setArchived(null),
              destructive: archived.status === 'ACTIVE',
              primary: archived.status === 'ARCHIVED',
            },
          ]}
        />
      )}

      {deleted && (
        <ConfirmModal
          title="Delete confirmation"
          content="Are you sure want to delete the package? This cannot be undone."
          onClose={() => setDeleted(null)}
          secondaryActions={[
            {
              content: 'Discard',
              onAction: () => setDeleted(null),
            },
            {
              content: 'Delete now',
              onAction: () => onDelete(deleted) & setDeleted(null),
              destructive: true,
            },
          ]}
        />
      )}

      {edited && (
        <PackageVersions
          {...props}
          code={code}
          selected={edited}
          onClose={() => setEdited(null)}
          editable={editable}
          importable={importable}
        />
      )}
    </div>
  )
}

export default Table
