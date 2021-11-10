import { motion } from 'framer-motion'
import React from 'react'
import helpers from '../helpers'
const Footer = props => {
  return (
    <motion.div
      key={`footer`}
      initial="initial"
      animate="in"
      exit="out"
      variants={helpers.variants}
      className="footer-container"
    >
      <div className="footer center fit pure-menu pure-menu-horizontal pure-menu-scrollable">
        <ul className="pure-menu-list">
          <li className="pure-menu-item">© 2021 Graham Hemsley</li>
          <li className="pure-menu-item">
            <a
              className="pure-menu-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.github.com/ghemsley"
            >
              Github
            </a>
          </li>
          <li className="pure-menu-item">
            <a
              className="pure-menu-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://grahamhemsley.com"
            >
              Portfolio
            </a>
          </li>
          <li className="pure-menu-item">
            <a
              className="pure-menu-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://grahamhemsley.com/blog"
            >
              Blog
            </a>
          </li>
        </ul>
        <div className="button-container"></div>
      </div>
    </motion.div>
  )
}

export default Footer
