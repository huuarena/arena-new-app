import { Card, Stack, Button, Layout, DisplayText, MediaCard, Banner } from '@shopify/polaris'
import AppHeader from '../components/AppHeader'
import UniqueCodeCard from '../components/UniqueCodeCard'
import DuplicatorCard from '../components/DuplicatorCard'
import SubmitionButton from '../components/SubmitionButton'
import { useEffect, useState } from 'react'
import Faqs from './faq/Faqs'

export default function HomePage(props) {
  const { screen, storeSetting, navigate } = props

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Home"
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('/support'),
          },
        ]}
      />

      {storeSetting.appPlan === 'BASIC' && (
        <Banner
          title="Your current app plan is BASIC plan"
          status="warning"
          action={{ content: 'Upgrade Plan', onAction: () => navigate('/pricing-plans') }}
          secondaryAction={{
            content: 'Read more about Pricing plans',
            onAction: () => navigate('/pricing-plans'),
          }}
        >
          <p>
            You are now using Export &amp; Import data with up to 500 items per resource, forever
            time.
          </p>
        </Banner>
      )}

      <div
        style={{
          display: 'flex',
          margin: '-0.5em',
          flexWrap: 'nowrap',
          flexDirection: props.screen === 'mobile' ? 'column' : 'row',
        }}
      >
        <div style={{ flex: 1, margin: '0.5em' }}>
          <UniqueCodeCard {...props} />
        </div>
        <div style={{ flex: 1, margin: '0.5em' }}>
          <DuplicatorCard {...props} />
        </div>
      </div>

      <Layout>
        {/* <Layout.AnnotatedSection title="New export data" description="">
          <Card sectioned>
            <Stack vertical>
              <div>You will be able to select the particular data items to backup.</div>
              <Button primary onClick={() => props.navigate('/export/new')}>
                New Export
              </Button>
            </Stack>
          </Card>
        </Layout.AnnotatedSection> */}

        {/* <Layout.AnnotatedSection title="Tutorials" description="">
          <Card sectioned>
            <Stack vertical>
              <div>Here you will find a collection of written and video tutorials.</div>
              <Button onClick={() => props.navigate('')}>See tutorials</Button>
            </Stack>
          </Card>
        </Layout.AnnotatedSection> */}

        {/* <Layout.AnnotatedSection title="Documentation" description="">
          <Card sectioned>
            <Stack vertical>
              <div>Specification for each kind of item, each and every field.</div>
              <Button onClick={() => props.navigate('/faq')}>Read documentation</Button>
            </Stack>
          </Card>
        </Layout.AnnotatedSection> */}

        <Layout.AnnotatedSection title="Resource stores management" description="">
          <Card sectioned>
            <Stack vertical>
              <div>Manage relationship with resource sites.</div>
              <Button
                onClick={() => props.navigate('/management/active-codes')}
                disabled={!Boolean(props.duplicators.length > 0)}
              >
                {props.duplicators.length > 0 ? 'Manage' : 'No active resource store'}
              </Button>
            </Stack>
          </Card>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection title="Support" description="">
          <Card sectioned>
            <Stack vertical>
              <div>
                If you have any questions, issues or concerns - don't guess, don't wait - contact us
                and we will help you.
              </div>
              <Button onClick={() => props.navigate('/support')}>Contact support</Button>
            </Stack>
          </Card>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection title="FAQs" description="">
          <Faqs items={props.faqs || []} limit={5} />
        </Layout.AnnotatedSection>
      </Layout>

      {['haloha-shop.myshopify.com'].includes(window.shopOrigin) && <SubmitionButton {...props} />}
    </Stack>
  )
}
