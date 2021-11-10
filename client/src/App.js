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
import { AnimatePresence } from 'framer-motion'

const App = () => {
  const location = useLocation()
  const background = location.state && location.state.background
  const edit = location.state && location.state.edit

  return (
    <div id="wrapper">
      <DragPreview />
      <div id="content" className="pure-u-1 content">
        <AnimatePresence>
          <Route
            key="navbar-route"
            children={routeProps => <Navbar key="navbar" {...routeProps} />}
          />
          <Switch key="page-switch" location={background ? background : location}>
            {Pages.map((Page, i) => (
              <Route
                exact
                path={Page.path}
                key={Page.name}
                render={routeProps => Page.component(routeProps)}
              />
            ))}
            <Redirect to="/" />
          </Switch>
        </AnimatePresence>
        {background && (
          <AnimatePresence exitBeforeEnter>
            <Switch key="modal-switch">
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
          </AnimatePresence>
        )}
      </div>
      <AnimatePresence>
        <Footer key="footer" />
      </AnimatePresence>
    </div>
  )
}

export default App
