import React from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import Pages from './pages'
import {
  Navbar,
  ProjectForm,
  CategoryForm,
  TodoForm,
  SignupForm,
  LoginForm,
  LogoutScreen,
  withAuth
} from './components'
import './App.css'

const AuthenticatedLoginForm = withAuth(LoginForm)
const AuthenticatedSignupForm = withAuth(SignupForm)
const ProtectedProjectForm = withAuth(ProjectForm)
const ProtectedCategoryForm = withAuth(CategoryForm)
const ProtectedTodoForm = withAuth(TodoForm)
const ProtectedLogoutScreen = withAuth(LogoutScreen)

function App() {
  const location = useLocation()
  const background = location.state && location.state.background
  const edit = location.state && location.state.edit

  return (
    <div className='pure-u-1'>
      <Navbar />
      <Switch location={background ? background : location}>
        {Pages.map((Page, i) => (
          <Route
            exact
            path={Page.path}
            key={i}
            children={routeProps => Page.component(routeProps)}
          />
        ))}
      </Switch>
      <Route exact path='/signup' children={<AuthenticatedSignupForm />} />
      <Route exact path='/login' children={<AuthenticatedLoginForm />} />
      <Route
        exact
        path='/logout'
        children={<ProtectedLogoutScreen protectedRoute />}
      />
      <Route
        exact
        path='/projects/new'
        children={<ProtectedProjectForm protectedRoute />}
      />
      <Route
        exact
        path='/categories/new'
        children={<ProtectedCategoryForm protectedRoute />}
      />
      <Route
        exact
        path='/todos/new'
        children={<ProtectedTodoForm protectedRoute />}
      />
      {edit && (
        <>
          <Route
            exact
            path='/todos/:id/edit'
            children={<ProtectedTodoForm edit={edit} protectedRoute />}
          />
          <Route
            exact
            path='/categories/:id/edit'
            children={<ProtectedCategoryForm edit={edit} protectedRoute />}
          />
          <Route
            exact
            path='/projects/:id/edit'
            children={<ProtectedProjectForm edit={edit} protectedRoute />}
          />
        </>
      )}
    </div>
  )
}

export default App
