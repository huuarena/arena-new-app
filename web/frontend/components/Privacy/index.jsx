import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, DisplayText, Stack } from '@shopify/polaris'
import formatDateTime from '../../helpers/formatDateTime'

import './styles.scss'

Privacy.propTypes = {
  // ...appProps,
  onAction: PropTypes.func,
  acceptedAt: PropTypes.string,
}

Privacy.defaultProps = {
  onAction: () => null,
  acceptedAt: null,
}

function Privacy(props) {
  const { privacy, onAction, acceptedAt } = props

  const actionSection = (
    <Stack distribution="equalSpacing" alignment="baseline">
      <Stack.Item>
        {Boolean(acceptedAt) && (
          <DisplayText size="small">
            <b>Accepted at: {formatDateTime(acceptedAt, 'LLL')}</b>
          </DisplayText>
        )}
      </Stack.Item>
      <Stack.Item>
        {onAction && (
          <Button primary onClick={onAction}>
            {acceptedAt ? 'Back to Home' : 'Accept privacy'}
          </Button>
        )}
      </Stack.Item>
    </Stack>
  )

  return (
    <Card sectioned>
      <div style={{ padding: '1rem' }} id="privacy">
        <Stack vertical alignmen="fill" spacing="extraLoose">
          {actionSection}

          <div dangerouslySetInnerHTML={{ __html: privacy?.attributes?.content || '' }} />

          {actionSection}
        </Stack>
      </div>
    </Card>
  )
}

export default Privacy
