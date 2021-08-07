import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import actions from '../actions'
import { Modal } from './index'

const LoginForm = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
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
    dispatch(
      actions.loginUser({
        email,
        password,
      })
    )
      .then(() => history.goBack())
      .catch(error => setError(error.message))
  }
  return (
    <Modal>
      <h1 className='fit margin-auto'>Login</h1>
      {error && <p>{error}</p>}
      <form
        onSubmit={handleSubmit}
        className='pure-form pure-form-stacked fit margin-auto'>
        <fieldset>
          <label htmlFor='email'>Email</label>
          <input
            type='text'
            name='email'
            value={email}
            onChange={handleChange}
          />
          <label htmlFor='password'>Password</label>
          <input name='password' value={password} onChange={handleChange} />
          <button className='pure-button pure-button-primary' type='submit'>
            Submit
          </button>
        </fieldset>
      </form>
    </Modal>
  )
}

export default LoginForm
