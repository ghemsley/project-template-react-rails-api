import React, { memo } from 'react'
import { useHistory } from 'react-router-dom'
import { ConfirmScreen } from '.'
import authHooks from '../hooks/auth'

const Auth = memo(({ protectedRoute, children }) => {
  const [data, errors] = authHooks.useCheckAuth()
  const history = useHistory()
  return data?.user ? (
    <>{children}</>
  ) : errors && protectedRoute ? (
    <ConfirmScreen closeAction={() => history.push('/')}>
      <p>You must be logged in to view this page</p>
    </ConfirmScreen>
  ) : errors ? (
    <>{children}</>
  ) : (
    <ConfirmScreen>
      <h1 className="loading">Loading...</h1>
    </ConfirmScreen>
  )
})

Auth.displayName = 'Auth'

export default Auth
