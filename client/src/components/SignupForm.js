import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { useMountedState } from 'react-use'
import actions from '../actions'
import authHooks from '../hooks/auth'
import { Modal } from './index'

const SignupForm = props => {
  const loggedIn = useSelector(state => state.authentication.loggedIn)
  const isMounted = useMountedState()
  const [start, setStart] = useState(false)
  const [done, setDone] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState(null)
  const history = useHistory()

  useEffect(() => {
    if (start && isMounted()) {
      setStart(false)
    }
  }, [start, isMounted])
  authHooks
    .useSignupUser(username, email, password, passwordConfirmation, start, setErrors)
    .then(data => {
      if (data && isMounted()) {
        setDone(true)
        if (loggedIn) history.push('/')
      }
    })

  const handleChange = event => {
    switch (event.target.name) {
      case 'username':
        setUsername(event.target.value)
        break
      case 'email':
        setEmail(event.target.value)
        break

      case 'password':
        setPassword(event.target.value)
        break

      case 'passwordConfirmation':
        setPasswordConfirmation(event.target.value)
        break

      default:
        break
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    if (
      username.length > 0 &&
      email.length > 0 &&
      password === passwordConfirmation &&
      isMounted()
    ) {
      !start && setStart(true)
      done && setDone(false)
      errors && setErrors(null)
    } else {
      let errorsArray = []
      if (username.length < 1) {
        errorsArray.push('You need to enter a username')
      }
      if (email.length < 1) {
        errorsArray.push('You need to enter an email')
      }
      if (password.length < 8) {
        errorsArray.push('Passwords must be at least 8 characters long')
      }
      if (password !== passwordConfirmation) {
        errorsArray.push('Your passwords do not match')
      }
      setErrors(errorsArray)
    }
  }
  return (
    <Modal>
      {loggedIn ? (
        <p>You are already logged in!</p>
      ) : !done ? (
        <>
          <h1 className="fit margin-auto">Login</h1>
          <p>Signing up...</p>
        </>
      ) : (
        <>
          <h1 className="fit margin-auto">New User</h1>
          {errors && errors.map((error, i) => <p key={i}>{error}</p>)}
          <form onSubmit={handleSubmit} className="pure-form pure-form-stacked fit margin-auto">
            <fieldset>
              <label htmlFor="username">Username</label>
              <input
                className="pure-input-1"
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                autoComplete="username"
              />
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
                autoComplete="new-password"
              />
              <label htmlFor="passwordConfirmation">Password confirmation</label>
              <input
                className="pure-input-1"
                name="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button className="pure-button pure-button-primary" type="submit">
                Submit
              </button>
            </fieldset>
          </form>
        </>
      )}
    </Modal>
  )
}

export default SignupForm
