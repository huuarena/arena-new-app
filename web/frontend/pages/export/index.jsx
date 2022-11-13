import { Stack, Card } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import DuplicatorPackageApi from '../../apis/duplicator_package'
import AppHeader from '../../components/AppHeader'
import Table from './Table'

function IndexPage(props) {
  const { actions, storeSetting, uniqueCodes } = props

  const code = uniqueCodes.find((item) => item.permission === 'ALL').code

  const [duplicatorPackages, setDuplicatorPackages] = useState(null)

  const getPackages = async () => {
    try {
      let query = `?code=${code}`
      let res = await DuplicatorPackageApi.getAll(query)
      if (!res.success) throw res.error

      // filter navigation package
      res.data = res.data.filter((item) => item.name.toUpperCase() !== 'NAVIGATION')

      setDuplicatorPackages(res.data)
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    }
  }

  useEffect(() => {
    getPackages()
  }, [])

  const handleArchive = async (selected) => {
    try {
      actions.showAppLoading()

      let status = selected.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE'

      let res = await DuplicatorPackageApi.update(selected.id, { status })
      if (!res.success) throw res.error

      let _duplicatorPackages = duplicatorPackages
        .map((item) => (item.id === selected.id ? res.data : item))
        .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0))
      setDuplicatorPackages(_duplicatorPackages)

      actions.showNotify({ message: status === 'ACTIVE' ? 'Actived' : 'Archived' })
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  const handleDelete = async (selected) => {
    try {
      actions.showAppLoading()

      let res = await DuplicatorPackageApi.delete(selected.id)
      if (!res.success) throw res.error

      let _duplicatorPackages = duplicatorPackages.filter((item) => item.id !== selected.id)
      setDuplicatorPackages(_duplicatorPackages)

      actions.showNotify({ message: 'Deleted' })
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Export data"
        onBack={() => props.navigate('')}
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('support'),
          },
          {
            label: 'Create new export',
            onClick: () => props.navigate('export/new'),
            primary: true,
          },
        ]}
      />

      <Card>
        <Table
          {...props}
          code={code}
          items={duplicatorPackages}
          onActive={(selected) => handleArchive(selected)}
          onDelete={(selected) => handleDelete(selected)}
          editable={true}
          importable={true}
        />
      </Card>
    </Stack>
  )
}

export default IndexPage
