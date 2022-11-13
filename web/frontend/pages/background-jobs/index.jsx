import { Card, Stack, Pagination, Button } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Table from './Table'
import BackgroundJobApi from '../../apis/background_job'

function IndexPage(props) {
  const { actions, location, navigate, storeSetting } = props

  const [searchParams, setSearchParams] = useSearchParams()

  const [backgroundJobs, setBackgroundJobs] = useState(null)

  const getBackgroundJobs = async (query) => {
    try {
      if (window.__getProgressTimeout) {
        clearTimeout(window.__getProgressTimeout)
      }

      let res = await BackgroundJobApi.find(query)
      if (!res.success) throw res.error

      setBackgroundJobs(res.data)

      // check running job
      let runningJob = res.data.items.find((item) => item.status === 'RUNNING')
      if (runningJob) {
        window.__getProgressTimeout = setTimeout(() => {
          getBackgroundJobs(query)
        }, 10000)
      }
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    getBackgroundJobs(location.search)

    // returned function will be called on component unmount
    return () => {
      clearTimeout(window.__getProgressTimeout)
    }
  }, [location.search])

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Background Jobs"
        onBack={() => props.navigate('')}
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('support'),
          },
        ]}
      />

      <div>Total: {backgroundJobs?.totalItems || 'loading..'}</div>

      <Card>
        <Table {...props} items={backgroundJobs?.items} />
      </Card>

      {backgroundJobs && (
        <Stack distribution="center">
          <Pagination
            hasPrevious={backgroundJobs.page > 1}
            onPrevious={() => setSearchParams({ page: backgroundJobs.page - 1 })}
            hasNext={backgroundJobs.page < backgroundJobs.totalPages}
            onNext={() => setSearchParams({ page: backgroundJobs.page + 1 })}
          />
        </Stack>
      )}
    </Stack>
  )
}

export default IndexPage
