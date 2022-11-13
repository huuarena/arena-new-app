import { Stack, Button } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import CreateForm from './CreateForm'
import DuplicatorPackageApi from '../../apis/duplicator_package'
import SkeletonPage from '../../components/SkeletonPage'
import qs from 'query-string'

function DetailPage(props) {
  const { actions, storeSetting, uniqueCodes } = props

  const id = props.location.pathname.split('/')[props.location.pathname.split('/').length - 1]
  const { v } = qs.parse(props.location.search)

  const [created, setCreated] = useState(null)

  const getDuplicatorPackage = async (id) => {
    try {
      let code = uniqueCodes.find((item) => item.permission === 'ALL').code

      let res = await DuplicatorPackageApi.findById(id, `?code=${code}`)
      if (!res.success) throw res.error

      setCreated(res.data)
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    getDuplicatorPackage(id)
  }, [])

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title={`Edit package: ${created?.name || 'loading..'}`}
        onBack={() => props.navigate('export')}
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('support'),
          },
        ]}
      />

      {!created && <SkeletonPage />}

      {created && (
        <CreateForm
          {...props}
          created={created}
          onDiscard={() => props.navigate('export')}
          version={created.versions.find((item) => item.id == v)}
        />
      )}
    </Stack>
  )
}

export default DetailPage
