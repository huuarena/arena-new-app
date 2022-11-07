import { Stack, Button } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import DuplicatorPackageApi from '../../apis/duplicator_package'
import SkeletonPage from '../../components/SkeletonPage'
import qs from 'query-string'
import CreateForm from './CreateForm'

function DetailPage(props) {
  const { actions, storeSetting, uniqueCodes } = props

  const id = props.location.pathname.split('/')[props.location.pathname.split('/').length - 1]
  const { v, c } = qs.parse(props.location.search)

  const [created, setCreated] = useState(null)

  const getDuplicatorPackage = async (id) => {
    try {
      let res = await DuplicatorPackageApi.findById(id, `?code=${c}`)
      if (!res.success) throw res.error

      let version = res.data.versions.find((item) => '' + item.id === '' + v)
      if (!version) {
        throw new Error('Package version not found')
      }

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
        title={`Import package: ${created?.name || ''}`}
        onBack={() => props.navigate('/import')}
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('/support'),
          },
        ]}
      />

      {!created && <SkeletonPage />}

      {created && (
        <CreateForm
          {...props}
          code={c}
          created={created}
          onDiscard={() => props.navigate('/import')}
          version={created.versions.find((item) => '' + item.id === '' + v)}
        />
      )}
    </Stack>
  )
}

export default DetailPage
