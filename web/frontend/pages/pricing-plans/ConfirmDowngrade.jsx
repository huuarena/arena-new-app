import { Modal, Stack, TextField } from '@shopify/polaris'
import PropTypes from 'prop-types'
import { useState } from 'react'

ConfirmDowngrade.propTypes = {
  // ...appProps,
  onDiscard: PropTypes.func,
  onSubmit: PropTypes.func,
}

ConfirmDowngrade.defaultProps = {
  onDiscard: () => null,
  onSubmit: () => null,
}

function ConfirmDowngrade(props) {
  const { onDiscard, onSubmit } = props

  const [shop, setShop] = useState({ value: '', error: '' })

  return (
    <Modal
      open={true}
      onClose={onDiscard}
      title="Confirm downgrade app plan"
      secondaryActions={[
        {
          content: 'Discard',
          onAction: onDiscard,
        },
        {
          content: 'Downgrade',
          onAction: onSubmit,
          destructive: true,
          disabled:
            shop.value !== window.shopOrigin || props.appLoading.action === 'downgrade_app_plan',
          loading: props.appLoading.action === 'downgrade_app_plan',
        },
      ]}
    >
      <Modal.Section>
        <div style={{ padding: '1em', background: '#fcf1ef' }}>
          <p>Are you sure want to downgrade app plan to BASIC plan?</p>
          <p>You will not be able to use advanced features.</p>
        </div>
      </Modal.Section>
      <Modal.Section>
        <Stack vertical>
          <Stack alignment="baseline" spacing="extraTight">
            <p>Enter your store</p>
            <p
              style={{
                padding: '2px 6px',
                color: '#1f1f1f',
                backgroundColor: '#f0f0f0',
                borderRadius: 3,
                display: 'inline-block',
              }}
            >
              {window.shopOrigin}
            </p>
            <p>to confirm.</p>
          </Stack>
          <TextField
            placeholder={window.shopOrigin}
            value={shop.value}
            error={shop.error}
            onChange={(value) => setShop({ value, error: '' })}
          />
        </Stack>
      </Modal.Section>
    </Modal>
  )
}

export default ConfirmDowngrade
