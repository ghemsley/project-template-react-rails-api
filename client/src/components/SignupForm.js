import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import actions from '../actions'
import { Modal } from './index'

const SignupForm = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState({ status: { message: '' } })
  const dispatch = useDispatch()
  const history = useHistory()

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
    dispatch(
      actions.signupUser({
        username,
        email,
        password,
        password_confirmation: passwordConfirmation
      })
    )
      .then(() => history.push('/'))
      .catch(error => setError(error))
  }
  return (
    <Modal>
      <h1 className='fit margin-auto'>New User</h1>
      {error && <p>{error.status.message}</p>}
      <form
        onSubmit={handleSubmit}
        className='pure-form pure-form-stacked fit margin-auto'>
        <fieldset>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            name='username'
            value={username}
            onChange={handleChange}
          />
          <label htmlFor='email'>Email</label>
          <input
            type='text'
            name='email'
            value={email}
            onChange={handleChange}
          />
          <label htmlFor='password'>Password</label>
          <input name='password' value={password} onChange={handleChange} />
          <label htmlFor='passwordConfirmation'>Password confirmation</label>
          <input
            name='passwordConfirmation'
            value={passwordConfirmation}
            onChange={handleChange}
          />
          <button className='pure-button pure-button-primary' type='submit'>
            Submit
          </button>
        </fieldset>
      </form>
    </Modal>
  )
}

export default SignupForm
