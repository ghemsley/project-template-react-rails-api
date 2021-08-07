import React from 'react'
import { ConfirmScreen } from './index'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import actions from '../actions'

const LogoutScreen = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const closeAction = () => history.goBack()
  const handleClick = () => {
    dispatch(actions.logoutUser()).then(() => {
      history.push('/')
    })
  }
  return (
    <ConfirmScreen closeAction={closeAction}>
      <h1>Confirm logout?</h1>
      <button className='pure-button pure-button-delete' onClick={handleClick}>Logout</button>
    </ConfirmScreen>
  )
}

export default LogoutScreen
