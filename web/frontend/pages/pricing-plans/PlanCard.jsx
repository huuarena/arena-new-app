import { Button, Card, DisplayText, Icon, Stack } from '@shopify/polaris'
import PropTypes from 'prop-types'
import { TickMinor, CancelSmallMinor } from '@shopify/polaris-icons'

PlanCard.propTypes = {
  // ...appProps,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
}

function PlanCard(props) {
  const { storeSetting, item, onSubmit } = props

  return (
    <Card>
      <Card.Section>
        <Stack distribution="equalSpacing" alignment="baseline">
          <DisplayText size="small">
            <span
              className={
                item.plan === 'PRO' ? 'color__link' : item.plan === 'PLUS' ? 'color__success' : ''
              }
            >
              <b>{item.plan}</b>
            </span>
          </DisplayText>
          <DisplayText size="small">
            <span
              className={
                item.plan === 'PRO' ? 'color__link' : item.plan === 'PLUS' ? 'color__success' : ''
              }
            >
              <b>{item.price === 0 ? 'FREE' : `$${item.price} / monthly`}</b>
            </span>
          </DisplayText>
        </Stack>
      </Card.Section>
      <Card.Section subdued title="Features">
        <Stack vertical spacing="tight">
          {item.features.map((_item, _index) => (
            <div
              key={_index}
              className={
                _item.supported
                  ? 'color__success pricing-plan-label'
                  : 'color__note pricing-plan-label'
              }
            >
              <Stack spacing="tight" wrap={false}>
                <Icon source={_item.supported ? TickMinor : CancelSmallMinor} />
                <div
                  style={{
                    fontSize: '1.1em',
                    fontWeight: 500,
                  }}
                >
                  {_item.label}
                </div>
              </Stack>
            </div>
          ))}
        </Stack>
      </Card.Section>
      <Card.Section>
        <Stack distribution="trailing">
          <Button
            fullWidth
            primary={item.plan !== 'BASIC' && !props.appLoading.loading}
            disabled={storeSetting.appPlan === item.plan || props.appLoading.loading}
            onClick={onSubmit}
          >
            <span style={{ textTransform: 'uppercase' }}>
              {storeSetting.appPlan === item.plan
                ? 'Current plan'
                : item.plan === 'BASIC'
                ? 'Downgrade'
                : 'Subscribe'}
            </span>
          </Button>
        </Stack>
      </Card.Section>
    </Card>
  )
}

export default PlanCard
