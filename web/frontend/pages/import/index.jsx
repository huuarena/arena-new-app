import { Stack, Button, Card, EmptyState } from '@shopify/polaris'
import AppHeader from '../../components/AppHeader'
import { useEffect, useState } from 'react'
import DuplicatorPackageApi from '../../apis/duplicator_package'
import { RefreshMinor } from '@shopify/polaris-icons'
import SelectDuplicatorStore from './SelectDuplicatorStore'
import Table from '../export/Table'
import DuplicatorCard from '../../components/DuplicatorCard'
import { emptyState } from '../../assets'

function IndexPage(props) {
  const { actions, storeSetting, duplicators } = props

  // /**
  //  * Check store is dev store
  //  */
  // if (!storeSetting.testStore && ['affiliate', 'partner_test'].includes(storeSetting.plan)) {
  //   return (
  //     <Card sectioned>
  //       <EmptyState
  //         heading="Sorry, the Import data feature no longer supports development stores"
  //         action={{ content: 'Contact us', onAction: () => props.navigate('/support') }}
  //         image={emptyState}
  //       >
  //         <p>Please kindly contact our customer service team.</p>
  //       </EmptyState>
  //     </Card>
  //   )
  // }

  const [duplicator, setDuplicator] = useState(null)
  const [duplicatorPackages, setDuplicatorPackages] = useState(null)

  useEffect(() => {
    setDuplicator(duplicators[0])
  }, [duplicators])

  const getPackages = async (code) => {
    try {
      setDuplicatorPackages(null)

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
    if (duplicator) {
      getPackages(duplicator.code.code)
    }
  }, [duplicator])

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Import data"
        onBack={() => props.navigate('/')}
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('/support'),
          },
        ]}
      />

      {!duplicator && <DuplicatorCard {...props} />}

      {duplicator && (
        <SelectDuplicatorStore
          {...props}
          value={duplicator.id}
          onChange={(value) => {
            let _duplicator = duplicators.find((item) => item.id === value)
            setDuplicator(_duplicator)
          }}
        />
      )}

      {duplicator && (
        <Card>
          <Table
            {...props}
            code={duplicator?.code?.code || ''}
            items={duplicatorPackages}
            onActive={(selected) => handleArchive(selected)}
            onDelete={(selected) => handleDelete(selected)}
            editable={false}
          />
        </Card>
      )}
    </Stack>
  )
}

export default IndexPage
