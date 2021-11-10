import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import helpers from '../helpers'
import Pages from '../pages/index'
import ConfirmScreen from './ConfirmScreen'
const Navbar = props => {
  const { authChecked, loggedIn, currentUser } = useSelector(state => state.authentication)
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
  const handleClick = event => {
    event.preventDefault()
    setShowModal(true)
  }
  return (
    <motion.div
      key={`navbar`}
      initial="initial"
      animate="in"
      exit="out"
      variants={helpers.variants}
      className="navbar-container"
    >
      <div className="navbar center fit pure-menu pure-menu-horizontal pure-menu-scrollable">
        <ul className="pure-menu-list">
          {Pages.map(Page =>
            (!loggedIn || !currentUser) && Page.protectedRoute ? (
              <li className="pure-menu-item" key={Page.name}>
                <Link
                  to={{ pathname: Page.path }}
                  className="pure-menu-link pure-menu-heading"
                  onClick={handleClick}
                >
                  {Page.name}
                </Link>
              </li>
            ) : (
              <li className="pure-menu-item" key={Page.name}>
                <Link to={{ pathname: Page.path }} className="pure-menu-link pure-menu-heading">
                  {Page.name}
                </Link>
              </li>
            )
          )}
          {!loggedIn && (
            <>
              <li className="pure-menu-item" key={'signup'}>
                <Link
                  className="pure-menu-link pure-menu-heading"
                  to={{ pathname: '/signup', state: { background: location } }}
                >
                  Sign up
                </Link>
              </li>
              <li className="pure-menu-item" key={'login'}>
                <Link
                  className="pure-menu-link pure-menu-heading"
                  to={{ pathname: '/login', state: { background: location } }}
                >
                  Login
                </Link>
              </li>
            </>
          )}
          {authChecked && loggedIn && currentUser.id && (
            <li className="pure-menu-item" key={'logout'}>
              <Link
                className="pure-menu-link pure-menu-heading"
                to={{ pathname: '/logout', state: { background: location } }}
              >
                Logout
              </Link>
            </li>
          )}
        </ul>
        {loggedIn && currentUser.id && <p>Logged in as {currentUser.username}</p>}
      </div>
      {showModal && (
        <ConfirmScreen closeAction={() => setShowModal(false)}>
          <p>You must be logged in to view this page</p>
        </ConfirmScreen>
      )}
    </motion.div>
  )
}

export default Navbar
