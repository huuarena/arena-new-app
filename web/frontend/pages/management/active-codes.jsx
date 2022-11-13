import { Button, Card, Checkbox, DataTable, Stack } from '@shopify/polaris'
import React, { useState } from 'react'
import AppHeader from '../../components/AppHeader'
import { MobileVerticalDotsMajor, EditMinor, DeleteMinor } from '@shopify/polaris-icons'
import { useEffect } from 'react'
import UniqueCodeApi from '../../apis/unique_code'
import ConfirmModal from '../../components/ConfirmModal'
import DuplicatorApi from '../../apis/duplicator'

function IndexPage(props) {
  const { actions, duplicators } = props

  const [selected, setSelected] = useState(null)
  const [edited, setEdited] = useState(null)
  const [deleted, setDeleted] = useState(null)

  const handleDelete = async (deleted) => {
    try {
      actions.showAppLoading()

      let res = await DuplicatorApi.delete(deleted.id)
      if (!res.success) throw res.error

      actions.getDuplicators()

      actions.showNotify({ message: 'Deleted!' })
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  let rows = duplicators.map((item) => [
    <Stack>
      <div>
        {item.originShop.name} ({item.originShop.shop})
      </div>
    </Stack>,
    <Stack>
      <div>{item.code.code}</div>
    </Stack>,
    <Stack>{item.purchaseCode}</Stack>,
    <Stack distribution="trailing" spacing="tight" wrap={false}>
      <Button icon={DeleteMinor} onClick={() => setDeleted(item)}></Button>
    </Stack>,
  ])

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="Resource Stores Management"
        onBack={() => props.navigate('')}
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('support'),
          },
        ]}
      />

      <Card>
        <DataTable
          columnContentTypes={['text', 'text', 'text', 'numeric']}
          headings={['Resource stores', 'Code', 'Purchase code', 'Action']}
          rows={rows}
          footerContent={rows.length > 0 ? undefined : 'Have no data'}
        />
      </Card>

      {deleted && (
        <ConfirmModal
          title="Delete confirmation"
          content="Are you sure want to delete the code? This cannot be undone."
          onClose={() => setDeleted(null)}
          secondaryActions={[
            {
              content: 'Discard',
              onAction: () => setDeleted(null),
            },
            {
              content: 'Delete now',
              onAction: () => handleDelete(deleted) & setDeleted(null),
              destructive: true,
            },
          ]}
        />
      )}
    </Stack>
  )
}

export default IndexPage
