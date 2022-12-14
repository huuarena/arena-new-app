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

  const [isLoading, setIsLoading] = useState(false)
  const [openConfirmDowngrade, setOpenConfirmDowngrade] = useState(false)

  useEffect(() => {
    if (!appBillings) {
      actions.getAppBillings()
    }
  }, [])

  const handleSubmit = async (id) => {
    try {
      actions.showAppLoading({ action: `submit_billing_${id}` })

      let res = await BillingApi.create(id)
      if (!res.success) throw res.error

      if (res.data?.confirmation_url) {
        // subscribe plan
        window.top.location.replace(res.data?.confirmation_url)
      } else {
        // downgrade plan
        window.top.location.replace(
          `https://${window.shopOrigin}/admin/apps/${window.SHOPIFY_API_KEY}/`
        )
      }
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      setTimeout(() => actions.hideAppLoading(), 1000)

      if (openConfirmDowngrade) {
        setOpenConfirmDowngrade(false)
      }
    }
  }

  let applicationCharge = null
  let currentBillingPlan = null
  let currentBillingPrice = 'FREE'
  let currentBillingTime = ''
  if (appBillings) {
    applicationCharge = appBillings.find((item) => item.type === 'application_charge')
    currentBillingPlan = appBillings.find(
      (item) => item.type === 'recurring_application_charge' && item.plan === storeSetting.appPlan
    )
    currentBillingPrice = currentBillingPlan.price === 0 ? 'FREE' : `$${currentBillingPlan.price}`
    currentBillingTime = currentBillingPlan.plan === 'BASIC' ? '' : ' / monthly'
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Pricing plans"
        onBack={() => props.navigate('')}
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('support'),
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
                          <b>$ {applicationCharge.price[storeSetting.appPlan]}</b>
                        </span>
                      </DisplayText>
                    </Stack>
                  </Stack>
                  <Button
                    onClick={() => handleSubmit(applicationCharge.id)}
                    primary
                    disabled={props.appLoading.action === `submit_billing_${1001}`}
                    loading={props.appLoading.action === `submit_billing_${1001}`}
                  >
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
                  {currentBillingPrice}
                  {currentBillingTime}
                </DisplayText>
                <Button onClick={() => props.navigate('support')}>Contact us</Button>
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
          onSubmit={() => handleSubmit(2001)}
        />
      )}
    </Stack>
  )
}

export default IndexPage
