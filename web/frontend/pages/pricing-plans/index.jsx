import { Banner, Button, Card, DisplayText, Layout, Stack } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import SkeletonPage from '../../components/SkeletonPage'
import { useEffect, useState } from 'react'
import BillingApi from '../../apis/billing'
import numberWithCommas from '../../helpers/numberWithCommas'
import PlanCard from './PlanCard'
import ConfirmDowngrade from './ConfirmDowngrade'

function IndexPage(props) {
  const { actions, storeSetting, appBillings } = props

  const [openConfirmDowngrade, setOpenConfirmDowngrade] = useState(false)

  useEffect(() => {
    if (!appBillings) {
      actions.getAppBillings()
    }
  }, [])

  const handleSubmit = async (id) => {
    try {
      actions.showAppLoading()

      let res = await BillingApi.create(id)
      if (!res.success) throw res.error

      if (res.data?.confirmation_url) {
        // subscribe plan
        window.top.location.replace(res.data?.confirmation_url)
      } else {
        // downgrade plan
        window.top.location.replace(`${window.BACKEND_URL}/api/auth?shop=${window.shopOrigin}`)
      }
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  let applicationCharge = null
  let currentPlan = null
  let currentPrice = 'FREE'
  let currentTime = ''
  if (appBillings) {
    applicationCharge = appBillings.find((item) => item.type === 'application_charge')
    currentPlan = appBillings.find((item) => item.plan === storeSetting.appPlan)
    currentPrice = currentPlan.price === 0 ? 'FREE' : `$${currentPlan.price}`
    currentTime = currentPlan.plan === 'BASIC' ? '' : ' / monthly'
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Pricing plans"
        onBack={() => props.navigate('/')}
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('/support'),
          },
        ]}
      />

      {!appBillings && <SkeletonPage />}

      {appBillings && (
        <Stack distribution="fillEvenly">
          {applicationCharge && (
            <Card>
              <Card.Section>
                <DisplayText size="small">
                  <b>App credits</b>
                </DisplayText>
              </Card.Section>
              <Card.Section>
                <Stack distribution="equalSpacing" alignment="trailing">
                  <Stack vertical spacing="extraTight">
                    <Stack alignment="baseline">
                      <div style={{ minWidth: 100 }}>
                        <DisplayText size="small">Credit point</DisplayText>
                      </div>
                      <DisplayText size="small">:</DisplayText>
                      <DisplayText size="small">
                        <span className="color__success">
                          <b>{numberWithCommas(applicationCharge.credits[storeSetting.appPlan])}</b>
                        </span>
                      </DisplayText>
                    </Stack>
                    <Stack alignment="baseline">
                      <div style={{ minWidth: 100 }}>
                        <DisplayText size="small">Price</DisplayText>
                      </div>
                      <DisplayText size="small">:</DisplayText>
                      <DisplayText size="small">
                        <span className="color__link">
                          <b>$ {numberWithCommas(applicationCharge.price[storeSetting.appPlan])}</b>
                        </span>
                      </DisplayText>
                    </Stack>
                  </Stack>
                  <Button primary onClick={() => handleSubmit(applicationCharge.id)}>
                    Get more credits
                  </Button>
                </Stack>
              </Card.Section>
            </Card>
          )}
          <Card>
            <Card.Section>
              <Stack distribution="equalSpacing" alignment="baseline">
                <DisplayText size="small">
                  <b>Current plan</b>
                </DisplayText>
                <DisplayText size="small">
                  <span
                    className={
                      storeSetting.appPlan === 'PRO'
                        ? 'color__link'
                        : storeSetting.appPlan === 'PLUS'
                        ? 'color__success'
                        : ''
                    }
                  >
                    <b>{storeSetting.appPlan}</b>
                  </span>
                </DisplayText>
              </Stack>
            </Card.Section>
            <Card.Section>
              <Stack distribution="equalSpacing" alignment="baseline">
                <DisplayText size="small">
                  {currentPrice}
                  {currentTime}
                </DisplayText>
                <Button onClick={() => props.navigate('/support')}>Contact us</Button>
              </Stack>
            </Card.Section>
          </Card>
        </Stack>
      )}

      {appBillings && (
        <Stack distribution="fillEvenly" alignment="fill">
          {appBillings
            .filter((item) => item.id >= 2001)
            .map((item, index) => (
              <Stack.Item key={index}>
                <PlanCard
                  {...props}
                  item={item}
                  onSubmit={() =>
                    item.id === 2001 ? setOpenConfirmDowngrade(true) : handleSubmit(item.id)
                  }
                />
              </Stack.Item>
            ))}
        </Stack>
      )}

      {openConfirmDowngrade && (
        <ConfirmDowngrade
          {...props}
          onDiscard={() => setOpenConfirmDowngrade(false)}
          onSubmit={() => handleSubmit(2001) & setOpenConfirmDowngrade(false)}
        />
      )}
    </Stack>
  )
}

export default IndexPage
