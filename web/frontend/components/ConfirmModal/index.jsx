import { Modal } from '@shopify/polaris'
import PropTypes from 'prop-types'

ConfirmModal.propTypes = {
  title: PropTypes.string,
  content: PropTypes.any,
  onDiscard: PropTypes.func,
  secondaryActions: PropTypes.array,
}

ConfirmModal.defaultProps = {
  title: '',
  content: null,
  onDiscard: () => null,
  secondaryActions: [],
}

function ConfirmModal(props) {
  const { title, content, onDiscard, secondaryActions } = props

  return (
    <Modal open={true} onClose={onDiscard} title={title} secondaryActions={secondaryActions}>
      <Modal.Section>{content}</Modal.Section>
    </Modal>
  )
}

export default ConfirmModal
