import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signedin</h1> : <h1>You are signedout</h1>
}

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/currentuser')

  return data
}

export default LandingPage
