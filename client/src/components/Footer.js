import React from 'react'
const Footer = (props) => {
  return (
    <div className='footer center fit pure-menu pure-menu-horizontal pure-menu-scrollable'>
      <ul className='pure-menu-list'>
        <li className='pure-menu-item'>© 2021 Graham Hemsley</li>
        <li className='pure-menu-item'>
          <a
            className='pure-menu-link'
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.github.com/ghemsley'>
            Github
          </a>
        </li>
        <li className='pure-menu-item'>
          <a
            className='pure-menu-link'
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.grahamhemsley.com'>
            Blog
          </a>
        </li>
      </ul>
      <div className='button-container'></div>
    </div>
  )
}

export default Footer
