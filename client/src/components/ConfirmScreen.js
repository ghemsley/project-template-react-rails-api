import React from 'react'
import { useHistory } from 'react-router-dom'

const ConfirmScreen = props => {
  const history = useHistory()
  const preventClose = event => {
    event.stopPropagation()
  }
  return (
    <div
      className='pure-g modal'
      onClick={props.closeAction ? props.closeAction : history.goBack}>
      <div className='pure-u-1 modal-child rounded' onClick={preventClose}>
        <span
          className='modal-close-button'
          onClick={props.closeAction ? props.closeAction : history.goBack}>
          ×
        </span>
        {props.children}
      </div>
    </div>
  )
}

export default ConfirmScreen
