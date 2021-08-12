import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import actions from '../actions'
import { Modal } from './index'

const LoginForm = props => {
  const loggedIn = useSelector(state => state.authentication.loggedIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState(null)
  const dispatch = useDispatch()
  const history = useHistory()

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
    setErrors(null)
    if (email.length > 0 && password.length > 0) {
      dispatch(
        actions.loginUser({
          email,
          password
        })
      )
        .then(() => history.push('/'))
        .catch(error => {
          setErrors([error.error])
        })
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
    <Modal>
      {loggedIn ? (
        <p>You are already logged in!</p>
      ) : (
        <>
          <h1 className='fit margin-auto'>Login</h1>
          {errors &&
            errors.length > 0 &&
            errors.map((error, i) => <p key={i}>{error}</p>)}
          {props.loggedIn && <p>You are already logged in</p>}
          {!props.loggedIn && (
            <form
              onSubmit={handleSubmit}
              className='pure-form pure-form-stacked fit margin-auto'>
              <fieldset>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  name='email'
                  value={email}
                  onChange={handleChange}
                  autoComplete='username'
                />
                <label htmlFor='password'>Password</label>
                <input
                  name='password'
                  type='password'
                  value={password}
                  onChange={handleChange}
                  autoComplete='current-password'
                />
                <button
                  className='pure-button pure-button-primary'
                  type='submit'>
                  Submit
                </button>
              </fieldset>
            </form>
          )}
        </>
      )}
    </Modal>
  )
}

export default LoginForm
