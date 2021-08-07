import React from 'react'
import Home from './Home'
import Categories from './Categories'
import Todos from './Todos'
import Projects from './Projects'
import { withAuth } from '../components'

const AuthenticatedHome = withAuth(Home)
const ProtectedProjects = withAuth(Projects)
const ProtectedCategories = withAuth(Categories)
const ProtectedTodos = withAuth(Todos)

const Pages = [
  {
    name: 'Home',
    component: routeProps => <AuthenticatedHome {...routeProps} />,
    path: '/',
    protectedRoute: false
  },
  {
    name: 'Projects',
    component: routeProps => (
      <ProtectedProjects protectedRoute {...routeProps} />
    ),
    path: '/projects',
    protectedRoute: true
  },
  {
    name: 'Categories',
    component: routeProps => (
      <ProtectedCategories protectedRoute {...routeProps} />
    ),
    path: '/categories',
    protectedRoute: true
  },
  {
    name: 'Todos',
    component: routeProps => <ProtectedTodos protectedRoute {...routeProps} />,
    path: '/todos',
    protectedRoute: true
  }
]

export { AuthenticatedHome, ProtectedProjects, ProtectedCategories, ProtectedTodos }
export default Pages
