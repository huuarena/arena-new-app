import PropTypes from 'prop-types'
import { Button, Card, Stack } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import FormValidate from '../../helpers/formValidate'
import FormControl from '../../components/FormControl'
import ProductApi from '../../apis/product'

CreateForm.propTypes = {
  // ...appProps,
  created: PropTypes.object,
}

CreateForm.defaultProps = {
  created: {},
}

const initFormData = {
  title: {
    type: 'text',
    label: 'Title',
    value: '',
    error: '',
    required: true,
    validate: {
      trim: true,
      required: [true, 'Required!'],
      minlength: [2, 'Too short!'],
      maxlength: [200, 'Too long!'],
    },
    focused: true,
  },
  body_html: {
    type: 'text',
    label: 'Description',
    value: '',
    error: '',
    required: true,
    validate: {
      trim: true,
      required: [true, 'Required!'],
      minlength: [2, 'Too short!'],
      maxlength: [2500, 'Too long!'],
    },
    multiline: 6,
  },
}

function CreateForm(props) {
  const { actions, created } = props

  const [formData, setFormData] = useState(null)

  useEffect(() => console.log('formData :>> ', formData), [formData])

  useEffect(() => {
    let _formData = JSON.parse(JSON.stringify(initFormData))

    if (created.id) {
      _formData.title.value = created.title || ''
      _formData.body_html.value = created.body_html || ''
    } else {
      /**
       * test
       */
      _formData.title.value = `Sample product - ${new Date().toString()}`
      _formData.body_html.value = `Sample product`
    }

    setFormData(_formData)
  }, [])

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    setFormData(_formData)
  }

  const handleSubmit = async () => {
    try {
      actions.showAppLoading()

      const { valid, data } = FormValidate.validateForm(formData)

      if (!valid) {
        setFormData(data)
        throw new Error('Invalid form data')
      }

      let _data = {
        product: {
          title: data.title.value,
          body_html: data.body_html.value,
        },
      }

      let res = null
      if (created.id) {
        // update
        res = await ProductApi.update(created.id, _data)
      } else {
        // create
        res = await ProductApi.create(_data)
      }
      if (!res.success) throw res.error

      actions.showNotify({ message: created.id ? 'Updated' : 'Created' })

      props.navigate('/products')
    } catch (error) {
      console.log(error)
      actions.showNotify({ error: true, message: error.message })
    } finally {
      actions.hideAppLoading()
    }
  }

  if (!formData) {
    return null
  }

  return (
    <Stack vertical alignment="fill">
      <Card sectioned>
        <Stack vertical alignment="fill">
          <FormControl {...formData['title']} onChange={(value) => handleChange('title', value)} />
          <FormControl
            {...formData['body_html']}
            onChange={(value) => handleChange('body_html', value)}
          />
        </Stack>
      </Card>

      <Stack distribution="trailing">
        <Button onClick={() => props.navigate('/products')}>Discard</Button>
        <Button primary onClick={handleSubmit}>
          {created.id ? 'Save' : 'Add'}
        </Button>
      </Stack>
    </Stack>
  )
}

export default CreateForm
