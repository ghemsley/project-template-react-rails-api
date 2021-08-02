import React from 'react'

const ConfirmScreen = props => {
  const preventClose = event => {
    event.stopPropagation()
  }
  return (
    <div className='pure-g modal' onClick={props.closeAction}>
      <div className='pure-u-1 modal-child rounded' onClick={preventClose}>
        <span className='modal-close-button' onClick={props.closeAction}>
          ×
        </span>
        {props.children}
      </div>
    </div>
  )
}

export default ConfirmScreen
