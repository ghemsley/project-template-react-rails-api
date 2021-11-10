import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useHistory } from 'react-router-dom'
import { createPortal } from 'react-dom'
import helpers from '../helpers'

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
              key={`confirmScreen`}
              initial="initial"
              animate="in"
              exit="out"
              variants={helpers.variants}
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
