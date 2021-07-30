import { Link } from 'react-router-dom'
import Pages from '../pages/index'

const Navbar = () => (
  <div className='center fit pure-menu pure-menu-horizontal pure-menu-scrollable'>
    <ul className='pure-menu-list'>
      {Pages.map((page, i) => (
        <li className='pure-menu-item' key={i}>
          <Link to={page.path} className='pure-menu-link'>
            {page.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default Navbar
