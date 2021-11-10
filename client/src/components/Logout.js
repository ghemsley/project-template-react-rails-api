import React from 'react'
import { Redirect } from 'react-router-dom'
import authHooks from '../hooks/auth'

const Logout = () => {
  const [data, errors] = authHooks.useLogoutUser()
  return !data && !errors ? <p>Logging out...</p> : <Redirect to="/" />
}

export default Logout
