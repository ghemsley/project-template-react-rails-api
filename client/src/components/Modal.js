import React, { useState } from 'react'
import { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

const Modal = props => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden')
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])
  const history = useHistory()
  const location = useLocation()
  const [show, setShow] = useState(true)
  const background = location.state && location.state.background

  const closeModal = () => {
    setShow(false)
    setTimeout(() => {
      background ? history.push(background.pathname) : history.push('/')
    }, 150)
  }
  const preventClose = event => {
    event.stopPropagation()
  }

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {show ? (
            <motion.div
              key="Modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              exit={{ opacity: 0 }}
              className="pure-g modal"
              onClick={closeModal}
            >
              <div className="pure-u-1 modal-child rounded" onClick={preventClose}>
                <span className="modal-close-button" onClick={closeModal}>
                  ×
                </span>
                {props.children}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

export default Modal
