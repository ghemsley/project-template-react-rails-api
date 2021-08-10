import { Link } from 'react-router-dom'
import Pages from '../pages/index'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
const Navbar = () => {
  const { authChecked, loggedIn, currentUser } = useSelector(
    state => state.authentication
  )
  const location = useLocation()
  return (
    <div className='navbar center fit pure-menu pure-menu-horizontal pure-menu-scrollable'>
      <ul className='pure-menu-list'>
        {Pages.map((page, i) => (
          <li className='pure-menu-item' key={i}>
            <Link to={{ pathname: page.path }} className='pure-menu-link pure-menu-heading'>
              {page.name}
            </Link>
          </li>
        ))}
        {!loggedIn && (
          <>
            <li className='pure-menu-item' key={'signup'}>
              <Link
                className='pure-menu-link pure-menu-heading'
                to={{ pathname: '/signup', state: { background: location } }}>
                Sign up
              </Link>
            </li>
            <li className='pure-menu-item' key={'login'}>
              <Link
                className='pure-menu-link pure-menu-heading'
                to={{ pathname: '/login', state: { background: location } }}>
                Login
              </Link>
            </li>
          </>
        )}
        {authChecked && loggedIn && currentUser.id && (
          <li className='pure-menu-item' key={'logout'}>
            <Link
              className='pure-menu-link pure-menu-heading'
              to={{ pathname: '/logout', state: { background: location } }}>
              Logout
            </Link>
          </li>
        )}
      </ul>
      {loggedIn && currentUser.id && <p>Logged in as {currentUser.username}</p>}
    </div>
  )
}

export default Navbar
