import { useEffect } from 'react'
import useRequest from '../../hooks/use-request'
import React from 'react'
import Router from 'next/router'

function SignOut() {
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  })
  useEffect(() => {
    doRequest()
  }, [])
  return <div>Signinig you out!!</div>
}

export default SignOut
