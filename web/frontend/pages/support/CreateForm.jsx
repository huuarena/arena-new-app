import PropTypes from 'prop-types'
import { Button, Card, Stack } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import FormValidate from '../../helpers/formValidate'
import FormControl from '../../components/FormControl'
import TicketApi from '../../apis/ticket'
import { InviteMinor } from '@shopify/polaris-icons'

CreateForm.propTypes = {
  // ..appProps,
}

CreateForm.defaultProps = {}

const SUBJECTS = [
  { label: 'Contact / Support', value: 'Contact / Support' },
  { label: 'Idea / Suggestion', value: 'Idea / Suggestion' },
  { label: 'Problem / Complaint', value: 'Problem / Complaint' },
  { label: 'Question', value: 'Question' },
]

const initFormData = {
  subject: {
    type: 'select',
    label: 'Subject',
    value: SUBJECTS[0].value,
    error: '',
    required: true,
    validate: {},
    options: SUBJECTS,
  },
  description: {
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
  email: {
    type: 'email',
    label: 'Email',
    value: '',
    error: '',
    required: true,
    validate: {
      trim: true,
      required: [true, 'Required!'],
      minlength: [2, 'Too short!'],
      maxlength: [200, 'Too long!'],
    },
  },
}

function CreateForm(props) {
  const { actions, storeSetting, onSubmit } = props

  const [formData, setFormData] = useState(initFormData)

  const generateFormData = () => {
    let _formData = JSON.parse(JSON.stringify(initFormData))
    _formData.email.value = storeSetting.email
    setFormData(_formData)
  }

  useEffect(() => generateFormData(), [])

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    setFormData(_formData)
  }

  const handleSubmit = async () => {
    try {
      let _formData = { ...formData }

      const { valid, data } = FormValidate.validateForm(formData)

      _formData = { ...data }

      if (!valid) {
        setFormData(_formData)
        throw new Error('Invalid form data')
      }

      actions.showAppLoading()

      let res = await TicketApi.create({
        subject: _formData.subject.value,
        description: _formData.description.value,
        email: _formData.email.value,
      })
      if (!res.success) throw res.error

      actions.showNotify({
        message: 'Ticket is created. We will take a look at your problem soon.',
      })

      generateFormData()
    } catch (error) {
      actions.showNotify({ error: true, message: error.message })
    } finally {
      actions.hideAppLoading()
    }
  }

  return (
    <Stack vertical alignment="fill">
      <Card sectioned>
        <Stack vertical alignment="fill">
          <FormControl
            {...formData['subject']}
            onChange={(value) => handleChange('subject', value)}
          />
          <FormControl
            {...formData['description']}
            onChange={(value) => handleChange('description', value)}
          />
          <FormControl {...formData['email']} onChange={(value) => handleChange('email', value)} />
          <Stack distribution="trailing">
            <Button
              onClick={handleSubmit}
              primary={!props.appLoading.loading}
              disabled={props.appLoading.loading}
              icon={InviteMinor}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  )
}

export default CreateForm
