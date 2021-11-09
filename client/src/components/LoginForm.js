import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { useMountedState } from 'react-use'
import actions from '../actions'
import authHooks from '../hooks/auth'
import ConfirmScreen from './ConfirmScreen'
import { Modal } from './index'

const LoginForm = props => {
  const loggedIn = useSelector(state => state.authentication.loggedIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState(null)
  const [start, setStart] = useState(false)
  const [done, setDone] = useState(true)
  const isMounted = useMountedState()
  const history = useHistory()

  useEffect(() => {
    if (start && isMounted()) {
      setStart(false)
    }
  }, [start, isMounted])
  authHooks.useLoginUser(email, password, start, setErrors).then(([data, errors]) => {
    if (!done && (data || errors) && isMounted()) {
      setDone(true)
      if (data?.user) history.push('/')
    }
  })

  const handleChange = event => {
    switch (event.target.name) {
      case 'email':
        setEmail(event.target.value)
        break

      case 'password':
        setPassword(event.target.value)
        break

      default:
        break
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    if (email.length > 0 && password.length > 0 && done && isMounted) {
      errors && setErrors(null)
      !start && setStart(true)
      setDone(false)
    } else {
      let errorsArray = []
      if (email.length < 1) {
        errorsArray.push('You need to enter a username')
      }
      if (password.length < 1) {
        errorsArray.push('You need to enter a password')
      }
      setErrors(errorsArray)
    }
  }
  return (
    <ConfirmScreen>
      {loggedIn ? (
        <p>You are already logged in!</p>
      ) : !done ? (
        <>
          <h1 className="fit margin-auto">Login</h1>
          <p>Logging in...</p>
        </>
      ) : (
        <>
          <h1 className="fit margin-auto">Login</h1>
          {errors && errors.length > 0 && errors.map((error, i) => <p key={i}>{error}</p>)}

          <form onSubmit={handleSubmit} className="pure-form pure-form-stacked fit margin-auto">
            <fieldset>
              <label htmlFor="email">Email</label>
              <input
                className="pure-input-1"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                autoComplete="username"
              />
              <label htmlFor="password">Password</label>
              <input
                className="pure-input-1"
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button className="pure-button pure-button-primary" type="submit">
                Submit
              </button>
            </fieldset>
          </form>
        </>
      )}
    </ConfirmScreen>
  )
}

export default LoginForm
