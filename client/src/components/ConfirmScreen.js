import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import { createPortal } from 'react-dom'

const ConfirmScreen = props => {
  const history = useHistory()
  const [show, setShow] = useState(true)
  const preventClose = event => {
    event.stopPropagation()
  }
  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      props.closeAction ? props.closeAction() : history.goBack()
    }, 150)
  }
  return (
    <>
      {createPortal(
        <AnimatePresence>
          {show ? (
            <motion.div
              key="ConfirmScreen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              exit={{ opacity: 0 }}
              className="pure-g modal"
              onClick={handleClose}
            >
              <div className="pure-u-1 modal-child rounded" onClick={preventClose}>
                <span className="modal-close-button" onClick={handleClose}>
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

export default ConfirmScreen
