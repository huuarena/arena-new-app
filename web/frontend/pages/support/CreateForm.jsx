import { Button, Card, Stack } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import ValidateForm from '../../helpers/validateForm'
import FormControl from '../../components/FormControl'
import TicketApi from '../../apis/ticket'
import { InviteMinor } from '@shopify/polaris-icons'

const SUBJECTS = ['Contact - Support', 'Idea - Suggestion', 'Problem - Complaint', 'Question'].map(
  (item) => ({ label: item, value: item })
)

const initFormData = {
  subject: {
    type: 'select',
    label: 'Subject',
    value: SUBJECTS[0].value,
    error: '',
    required: true,
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
  const { actions, storeSetting } = props

  const [formData, setFormData] = useState(null)

  const generateFormData = () => {
    let _formData = JSON.parse(JSON.stringify(initFormData))
    _formData.email.value = storeSetting.email
    setFormData(_formData)
  }

  useEffect(() => {
    generateFormData()
  }, [])

  const handleChange = (name, value) => {
    let _formData = JSON.parse(JSON.stringify(formData))
    _formData[name] = { ..._formData[name], value, error: '' }
    setFormData(_formData)
  }

  const handleSubmit = async () => {
    try {
      const { formValid, validFormData } = ValidateForm.validateForm(formData)

      if (!formValid) {
        setFormData(validFormData)
        throw new Error('Invalid form data')
      }

      actions.showAppLoading({ action: 'submit_ticket' })

      let data = {
        subject: validFormData.subject.value,
        description: validFormData.description.value,
        email: validFormData.email.value,
      }

      let res = await TicketApi.create(data)
      if (!res.success) throw res.error

      actions.showNotify({ message: 'Ticket sent. We will take a look at your ticket soon.' })

      generateFormData()
    } catch (error) {
      console.log(error)
      actions.showNotify({ error: true, message: error.message })
    } finally {
      actions.hideAppLoading()
    }
  }

  if (!formData) return null

  return (
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
            primary
            icon={InviteMinor}
            disabled={props.appLoading.action === 'submit_ticket'}
            loading={props.appLoading.action === 'submit_ticket'}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Card>
  )
}

export default CreateForm
