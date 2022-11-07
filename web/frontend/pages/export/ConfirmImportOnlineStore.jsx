import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Modal, Select, Stack } from '@shopify/polaris'
import formatDateTime from '../../helpers/formatDateTime'
import { generateFilterString } from '../../components/Condition/actions'
import VersionDetail from './VersionDetail'

ConfirmImportOnlineStore.propTypes = {
  // ...appProps,
  selected: PropTypes.object,
  onDiscard: PropTypes.func,
  onSubmit: PropTypes.func,
}

ConfirmImportOnlineStore.defaultProps = {
  selected: null,
  onDiscard: () => null,
  onSubmit: () => null,
}

function ConfirmImportOnlineStore(props) {
  const { actions, selected, onSubmit, onDiscard } = props

  const [version, setVersion] = useState(selected.versions[0])

  return (
    <Modal
      open={true}
      onClose={onDiscard}
      title="Import confirmation"
      secondaryActions={[
        {
          content: 'Discard',
          onAction: onDiscard,
        },
        {
          content: 'Import now',
          onAction: () => onSubmit({ version }),
          primary: Boolean(version && version.status === 'COMPLETED'),
          disabled: !Boolean(version && version.status === 'COMPLETED'),
        },
      ]}
    >
      <Modal.Section subdued>
        <Select
          label="Select a package"
          options={selected.versions.map((item, index) => ({
            label: `${item.version} - ${item.name}`,
            value: '' + item.id,
          }))}
          value={'' + version.id}
          onChange={(value) => setVersion(selected.versions.find((item) => item.id == value))}
          disabled={selected.versions.length <= 1}
        />
      </Modal.Section>
      <Modal.Section subdued>
        <VersionDetail version={version} />
      </Modal.Section>
    </Modal>
  )
}

export default ConfirmImportOnlineStore
