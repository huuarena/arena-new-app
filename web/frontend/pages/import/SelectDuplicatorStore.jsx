import React, { useState } from 'react'
import { ActionList, Button, Card, DisplayText, Popover, Stack } from '@shopify/polaris'

const generateLabel = (item) => `${item.originShop?.name} (${item.originShop?.shop})`

function SelectDuplicatorStore(props) {
  const { duplicators, value, onChange } = props

  const [popoverActive, setPopoverActive] = useState(false)

  const items = duplicators.filter((item) => item.id !== value)

  return (
    <Popover
      active={popoverActive}
      activator={
        <Stack vertical spacing="extraTight">
          <div>Select resource site:</div>
          <Button
            disclosure
            onClick={() => setPopoverActive(!popoverActive)}
            primary={items.length > 0}
            disabled={items.length === 0}
          >
            {generateLabel(duplicators.find((item) => item.id === value))}
          </Button>
        </Stack>
      }
      onClose={() => setPopoverActive(false)}
    >
      <ActionList
        actionRole="menuitem"
        items={items.map((item) => ({
          content: generateLabel(item),
          onAction: () => onChange(item.id) & setPopoverActive(false),
        }))}
      />
    </Popover>
  )
}

export default SelectDuplicatorStore
