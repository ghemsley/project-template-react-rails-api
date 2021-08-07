import { Route, Switch, useLocation } from 'react-router-dom'
import {
  Navbar,
  ProjectForm,
  CategoryForm,
  TodoForm,
  SignupForm,
  LoginForm,
  LogoutScreen,
  withAuth
} from './components/index'
import { useDispatch, useSelector } from 'react-redux'
import Pages from './pages/index'
import './App.css'

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
        {Pages.map((page, i) => (
          <Route
            exact
            path={page.path}
            key={i}
            component={
              page.protected ? withAuth(page.component) : page.component
            }
          />
        ))}
      </Switch>
      {background && (
        <>
          <Route
            exact
            path='/projects/new'
            children={<ProtectedProjectForm />}
          />
          <Route
            exact
            path='/categories/new'
            children={<ProtectedCategoryForm />}
          />
          <Route exact path='/todos/new' children={<ProtectedTodoForm />} />
          {edit && (
            <>
              <Route
                exact
                path='/todos/:id/edit'
                children={<ProtectedTodoForm edit={edit} />}
              />
              <Route
                exact
                path='/categories/:id/edit'
                children={<ProtectedCategoryForm edit={edit} />}
              />
              <Route
                exact
                path='/projects/:id/edit'
                children={<ProtectedProjectForm edit={edit} />}
              />
            </>
          )}

          <Route exact path='/signup' children={<SignupForm />} />
          <Route exact path='/login' children={<LoginForm />} />
          <Route exact path='/logout' children={<ProtectedLogoutScreen />} />
        </>
      )}
    </div>
  )
}

export default App
