import PropTypes from 'prop-types'
import SubmitionApi from '../../apis/submition'
import { Button } from '@shopify/polaris'

SubmitionButton.propTypes = {
  // ...appProps
}

function SubmitionButton(props) {
  const { actions } = props

  const handleSubmit = async () => {
    try {
      actions.showAppLoading()

      let res = await SubmitionApi.submit()
      if (!res.success) throw res.error

      console.log('\nSubmition:')
      console.log(res.data)

      actions.showNotify({ message: 'Submition successful' })
    } catch (error) {
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideAppLoading()
    }
  }

  return <Button onClick={handleSubmit}>Submit test</Button>
}

export default SubmitionButton
