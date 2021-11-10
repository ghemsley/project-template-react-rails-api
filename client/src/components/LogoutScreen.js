import React, { useState } from 'react'
import { ConfirmScreen } from './index'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import actions from '../actions'
import Logout from './Logout'

const LogoutScreen = () => {
  const history = useHistory()
  const [showLogout, setShowLogout] = useState(false)
  const closeAction = () => history.goBack()
  const handleClick = () => {
    setShowLogout(true)
  }
  return (
    <ConfirmScreen closeAction={closeAction}>
      {showLogout ? (
        <Logout />
      ) : (
        <>
          <h1>Confirm logout?</h1>
          <button className="pure-button pure-button-delete" onClick={handleClick}>
            Logout
          </button>
        </>
      )}
    </ConfirmScreen>
  )
}

export default LogoutScreen
