import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { ActionList, Badge, Button, DataTable, Popover, Stack } from '@shopify/polaris'
import formatDateTime from '../../helpers/formatDateTime'
import { MobileVerticalDotsMajor, ImagesMajor } from '@shopify/polaris-icons'
import DuplicatorPackageApi from '../../apis/duplicator_package'
import ConfirmModal from '../../components/ConfirmModal'
import PackageVersions from './PackageVersions'
import ConfirmImportOnlineStore from './ConfirmImportOnlineStore'
import ConfirmImportTheme from './ConfirmImportTheme'
import SelectPackageVersion from './SelectPackageVersion'

Table.propTypes = {
  // ...appProps,
  uuid: PropTypes.string,
  onLoading: PropTypes.func,
  editable: PropTypes.bool,
  importable: PropTypes.bool,
  permission: PropTypes.string,
}

Table.defaultProps = {
  uuid: '',
  onLoading: () => null,
  editable: false,
  importable: true,
  permission: 'ALL',
}

const BadgeStatuses = {
  ACTIVE: 'success',
  DRAFT: '',
  ARCHIVED: '',
  COMPLETED: 'success',
  PENDING: 'warning',
  RUNNING: 'info',
  FAILED: 'critical',
  CANCELED: 'attention',
}

const getStatus = (item) => {
  let statuses = item.versions.map((item) => item.status)

  if (statuses.includes('COMPLETED')) {
    return 'ACTIVE'
  }

  return statuses[0]
}

function Table(props) {
  const { actions, storeSetting, uuid, onLoading, editable, importable, permission } = props

  const [backupPackages, setBackupPackages] = useState(null)
  const [selected, setSelected] = useState(null)
  const [edited, setEdited] = useState(null)
  const [archived, setArchived] = useState(null)
  const [deleted, setDeleted] = useState(null)
  const [imported, setImported] = useState(null)
  const [packageVersions, setPackageVersions] = useState(null)

  const getBackupPackages = async () => {
    try {
      setBackupPackages(null)
      onLoading(true)

      let where = {}
      if (!editable) {
        where = { ...where, status: 'ACTIVE' }
      }
      let query = `?uuid=${uuid}&where=${JSON.stringify(where)}`
      let res = await DuplicatorPackageApi.find(query)
      if (!res.success) throw res.error

      setBackupPackages(res.data)
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      onLoading(false)
    }
  }

  useEffect(() => {
    getBackupPackages()
  }, [uuid])

  const handleArchive = async (selected) => {
    try {
      actions.showAppLoading()

      let status = selected.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE'

      let res = await DuplicatorPackageApi.update(selected.id, { status })
      if (!res.success) throw res.error

      let _backupPackages = { ...backupPackages }
      _backupPackages.items = _backupPackages.items
        .map((item) => (item.id === selected.id ? res.data : item))
        .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0))
      setBackupPackages(_backupPackages)

      actions.showNotify({ message: status === 'ACTIVE' ? 'Actived' : 'Archived' })
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  const handleDelete = async (selected) => {
    try {
      actions.showAppLoading()

      let res = await DuplicatorPackageApi.delete(selected.id)
      if (!res.success) throw res.error

      let _backupPackages = { ...backupPackages }
      _backupPackages.items = _backupPackages.items.filter((item) => item.id !== selected.id)
      setBackupPackages(_backupPackages)

      actions.showNotify({ message: 'Deleted' })
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  const handleImport = async ({ imported, version, themeId, themeName }) => {
    try {
      actions.showAppLoading()

      let data = {
        uuid,
        duplicatorPackageId: imported.id,
        versionId: version.id,
      }
      if (themeName) {
        data.themeName = themeName
      } else {
        data.themeId = themeId
      }

      let res = await DuplicatorPackageApi.import(data)
      if (!res.success) throw res.error

      actions.showNotify({ message: 'Process is running in background. Waiting for finnish.' })

      props.navigate('/background-jobs')
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  const renderActionList = (item) => {
    let actionList = []

    if (editable) {
      // actionList.push({
      //   content: 'Edit',
      //   onAction: () => setEdited(item) & setSelected(null),
      // })
      actionList.push({
        content: item.status === 'ACTIVE' ? 'Move to Archived' : 'Move to Active',
        onAction: () => setArchived(item) & setSelected(null),
      })
      actionList.push({
        content: 'Delete',
        onAction: () => setDeleted(item) & setSelected(null),
        disabled: !['ARCHIVED'].includes(item.status),
      })
    }

    if (importable) {
      actionList.push({
        content: 'Import',
        onAction: () => setImported(item) & setSelected(null),
        disabled: !['ACTIVE'].includes(item.status),
      })
    }

    return actionList
  }

  let rows = []
  if (backupPackages?.items?.length) {
    rows = backupPackages?.items.map((item, index) => {
      return [
        index + 1,
        <div style={{ maxWidth: 240, whiteSpace: 'normal' }}>
          <p>
            <b>{item.name}</b>
          </p>
          <p>{item.description}</p>
        </div>,
        <Badge status={BadgeStatuses[getStatus(item)]}>{getStatus(item)}</Badge>,
        <Button plain onClick={() => setPackageVersions(item)}>
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
        footerContent={
          backupPackages?.items ? (backupPackages?.items?.length > 0 ? undefined : 'Have no data') : 'loading..'
        }
      />

      {edited && (
        <SelectPackageVersion
          {...props}
          selected={edited}
          onDiscard={() => setEdited(null)}
          onSubmit={(selected) => props.navigate(`/export/${edited.id}?v=${selected}`)}
        />
      )}

      {archived && (
        <ConfirmModal
          title={`${archived.status === 'ACTIVE' ? 'Archive' : 'Active'} confirmation`}
          content={`Are you sure want to ${
            archived.status === 'ACTIVE' ? 'archive' : 'active'
          } the package. You can undo again.`}
          onClose={() => setArchived(null)}
          secondaryActions={[
            {
              content: 'Discard',
              onAction: () => setArchived(null),
            },
            {
              content: `${archived.status === 'ACTIVE' ? 'Archive' : 'Active'} now`,
              onAction: () => handleArchive(archived) & setArchived(null),
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
              onAction: () => handleDelete(deleted) & setDeleted(null),
              destructive: true,
            },
          ]}
        />
      )}

      {imported ? (
        imported.versions[0].resources[0].type === 'theme' ? (
          <ConfirmImportTheme
            {...props}
            selected={imported}
            onSubmit={(data) => handleImport({ imported, ...data }) & setImported(null)}
            onDiscard={() => setImported(null)}
            permission={permission}
          />
        ) : (
          <ConfirmImportOnlineStore
            {...props}
            selected={imported}
            onSubmit={(data) => handleImport({ imported, ...data }) & setImported(null)}
            onDiscard={() => setImported(null)}
          />
        )
      ) : null}

      {packageVersions && (
        <PackageVersions
          {...props}
          selected={packageVersions}
          onClose={() => setPackageVersions(null)}
          editable={editable}
        />
      )}
    </div>
  )
}

export default Table
