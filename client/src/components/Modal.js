import React from 'react'
import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
const Modal = props => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden')
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])
  const history = useHistory()
  const location = useLocation()
  const background = location.state && location.state.background

  const closeModal = () => {
    background ? history.push(background.pathname) : history.push('/')
  }
  const preventClose = event => {
    event.stopPropagation()
  }

  return (
    <>
      {createPortal(
        <div className='pure-g modal' onClick={closeModal}>
          <div className='pure-u-1 modal-child rounded' onClick={preventClose}>
            <span className='modal-close-button' onClick={closeModal}>
              ×
            </span>
            {props.children}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default Modal
