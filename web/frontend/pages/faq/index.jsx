import { Button, Card, Stack, TextField } from '@shopify/polaris'
import { useState } from 'react'
import AppHeader from '../../components/AppHeader'
import { useLocation, useSearchParams } from 'react-router-dom'
import './styles.scss'
import { useEffect } from 'react'
import qs from 'query-string'
import SkeletonPage from '../../components/SkeletonPage'
import Faqs from './Faqs'

function IndexPage(props) {
  const { actions, faqs } = props

  const location = useLocation()

  const [search, setSearch] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const { search } = qs.parse(location.search)
    if (search) {
      setSearch(search)
    }
  }, [])

  const handleSearch = (value) => {
    setSearch(value)
    setSearchParams(value ? qs.stringify({ search: value }) : '')
  }

  let items = faqs
    ? search
      ? faqs.filter(
          (item) =>
            item.attributes.title.toLowerCase().includes(search.toLowerCase()) ||
            item.attributes.body_html.toLowerCase().includes(search.toLowerCase()) ||
            item.attributes.handle.toLowerCase().includes(search.toLowerCase())
        )
      : faqs
    : []

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        {...props}
        title="FAQs"
        onBack={() => props.navigate('/')}
        primaryActions={[
          {
            label: 'Contact us',
            onClick: () => props.navigate('/support'),
          },
        ]}
      />

      <Card sectioned>
        <TextField
          placeholder="search"
          value={search || ''}
          onChange={handleSearch}
          clearButton
          onClearButtonClick={() => handleSearch('')}
        />
      </Card>

      {!faqs && <SkeletonPage />}

      {faqs && <Faqs items={items} />}
    </Stack>
  )
}

export default IndexPage
