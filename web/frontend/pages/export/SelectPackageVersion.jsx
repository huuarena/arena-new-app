import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Modal, Select, Stack } from '@shopify/polaris'
import formatDateTime from '../../helpers/formatDateTime'
import { generateFilterString } from '../../components/Condition/actions'
import VersionDetail from './VersionDetail'

SelectPackageVersion.propTypes = {
  // ...appProps,
  selected: PropTypes.object,
  onDiscard: PropTypes.func,
  onSubmit: PropTypes.func,
}

SelectPackageVersion.defaultProps = {
  selected: null,
  onDiscard: () => null,
  onSubmit: () => null,
}

function SelectPackageVersion(props) {
  const { actions, selected, onSubmit, onDiscard } = props

  const [version, setVersion] = useState(selected.versions[0])

  return (
    <Modal
      large
      open={true}
      onClose={onDiscard}
      title="Select a package version"
      secondaryActions={[
        {
          content: 'Discard',
          onAction: onDiscard,
        },
        {
          content: 'Continue',
          onAction: () => onSubmit(version.id),
          primary: true,
        },
      ]}
    >
      <Modal.Section subdued>
        <Select
          label="Select a package version"
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

export default SelectPackageVersion
