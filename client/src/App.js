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
  Footer,
  Loading,
  DragPreview,
  Auth,
} from './components'
import './App.css'
import './scss/global.scss'

const App = () => {
  const location = useLocation()
  const background = location.state && location.state.background
  const edit = location.state && location.state.edit

  return (
    <>
      <DragPreview />
      <div className="pure-u-1 content">
        <Route children={routeProps => <Navbar {...routeProps} />} />
        <Switch location={background ? background : location}>
          {Pages.map((Page, i) => (
            <Route
              exact
              path={Page.path}
              key={i}
              render={routeProps => Page.component(routeProps)}
            />
          ))}
          <Redirect to="/" />
        </Switch>
        {background && (
          <Switch>
            <Route
              exact
              path="/signup"
              render={routeProps => (
                <Auth>
                  <SignupForm {...routeProps} />
                </Auth>
              )}
            />
            <Route
              exact
              path="/login"
              render={routeProps => (
                <Auth>
                  <LoginForm {...routeProps} />
                </Auth>
              )}
            />
            <Route
              exact
              path="/logout"
              render={routeProps => (
                <Auth>
                  <LogoutScreen {...routeProps} />
                </Auth>
              )}
            />
            <Route
              exact
              path="/projects/new"
              render={routeProps => (
                <Auth protectedRoute>
                  <ProjectForm {...routeProps} />
                </Auth>
              )}
            />
            <Route
              exact
              path="/categories/new"
              render={routeProps => (
                <Auth protectedRoute>
                  <CategoryForm {...routeProps} />
                </Auth>
              )}
            />
            <Route
              exact
              path="/todos/new"
              render={routeProps => (
                <Auth protectedRoute>
                  <TodoForm {...routeProps} />
                </Auth>
              )}
            />
            {edit && (
              <>
                <Route
                  exact
                  path="/todos/:id/edit"
                  render={routeProps => (
                    <Auth protectedRoute>
                      <TodoForm edit={edit} {...routeProps} />
                    </Auth>
                  )}
                />
                <Route
                  exact
                  path="/categories/:id/edit"
                  render={routeProps => (
                    <Auth protectedRoute>
                      <CategoryForm edit={edit} {...routeProps} />
                    </Auth>
                  )}
                />
                <Route
                  exact
                  path="/projects/:id/edit"
                  render={routeProps => (
                    <Auth protectedRoute>
                      <ProjectForm edit={edit} {...routeProps} />
                    </Auth>
                  )}
                />
              </>
            )}
          </Switch>
        )}
      </div>
      <Footer />
      <Loading />
    </>
  )
}

export default App
