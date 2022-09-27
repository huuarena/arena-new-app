import Privacy from '../../components/Privacy'

function IndexPage(props) {
  return <Privacy acceptedAt={props.storeSetting.acceptedAt} onAction={() => props.navigate('/')} />
}

export default IndexPage
