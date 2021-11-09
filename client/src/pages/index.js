import React from 'react'
import Home from './Home'
import Categories from './Categories'
import Todos from './Todos'
import Projects from './Projects'
import { Auth } from '../components'

const Pages = [
  {
    name: 'Home',
    component: routeProps => (
      <Auth>
        <Home {...routeProps} />
      </Auth>
    ),
    path: '/',
    protectedRoute: false,
  },
  {
    name: 'Projects',
    component: routeProps => (
      <Auth protectedRoute>
        <Projects {...routeProps} />
      </Auth>
    ),
    path: '/projects',
    protectedRoute: true,
  },
  {
    name: 'Categories',
    component: routeProps => (
      <Auth protectedRoute>
        <Categories protectedRoute {...routeProps} />
      </Auth>
    ),
    path: '/categories',
    protectedRoute: true,
  },
  {
    name: 'Todos',
    component: routeProps => (
      <Auth protectedRoute>
        <Todos protectedRoute {...routeProps} />
      </Auth>
    ),
    path: '/todos',
    protectedRoute: true,
  },
]
export default Pages
