import React from 'react'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
import Pages from './pages' // order matters
import {
  Navbar,
  ProjectForm,
  CategoryForm,
  TodoForm,
  SignupForm,
  LoginForm,
  LogoutScreen,
  withAuth, // order matters,
  Footer,
  Loading
} from './components'
import './App.css'

const AuthenticatedLoginForm = withAuth(LoginForm)
const AuthenticatedSignupForm = withAuth(SignupForm)
const ProtectedProjectForm = withAuth(ProjectForm)
const ProtectedCategoryForm = withAuth(CategoryForm)
const ProtectedTodoForm = withAuth(TodoForm)
const ProtectedLogoutScreen = withAuth(LogoutScreen)

const App = () => {
  const location = useLocation()
  const background = location.state && location.state.background
  const edit = location.state && location.state.edit

  return (
    <>
      <div className='pure-u-1 content'>
        <Route children={routeProps => <Navbar {...routeProps} />} />
        <Switch location={background ? background : location}>
          {Pages.map((Page, i) =>
            Page.protectedRoute ? (
              <Route
                exact
                path={Page.path}
                key={i}
                render={routeProps => Page.component(routeProps)}
              />
            ) : (
              <Route
                exact
                path={Page.path}
                key={i}
                children={routeProps => Page.component(routeProps)}
              />
            )
          )}
          <Redirect to='/' />
        </Switch>
        {background && (
          <Switch>
            <Route
              exact
              path='/signup'
              render={routeProps => <AuthenticatedSignupForm {...routeProps} />}
            />
            <Route
              exact
              path='/login'
              render={routeProps => <AuthenticatedLoginForm {...routeProps} />}
            />
            <Route
              exact
              path='/logout'
              render={routeProps => (
                <ProtectedLogoutScreen protectedRoute {...routeProps} />
              )}
            />
            <Route
              exact
              path='/projects/new'
              render={routeProps => (
                <ProtectedProjectForm protectedRoute {...routeProps} />
              )}
            />
            <Route
              exact
              path='/categories/new'
              render={routeProps => (
                <ProtectedCategoryForm protectedRoute {...routeProps} />
              )}
            />
            <Route
              exact
              path='/todos/new'
              render={routeProps => (
                <ProtectedTodoForm protectedRoute {...routeProps} />
              )}
            />
            {edit && (
              <>
                <Route
                  exact
                  path='/todos/:id/edit'
                  render={routeProps => (
                    <ProtectedTodoForm
                      edit={edit}
                      protectedRoute
                      {...routeProps}
                    />
                  )}
                />
                <Route
                  exact
                  path='/categories/:id/edit'
                  render={routeProps => (
                    <ProtectedCategoryForm
                      edit={edit}
                      protectedRoute
                      {...routeProps}
                    />
                  )}
                />
                <Route
                  exact
                  path='/projects/:id/edit'
                  render={routeProps => (
                    <ProtectedProjectForm
                      edit={edit}
                      protectedRoute
                      {...routeProps}
                    />
                  )}
                />
              </>
            )}
          </Switch>
        )}
      </div>
      <Route children={routeProps => <Footer {...routeProps} />} />
      <Route render={routeProps => <Loading {...routeProps} />} />
    </>
  )
}

export default App
