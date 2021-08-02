import { Route, Switch, useLocation } from 'react-router-dom'
import { Navbar, ProjectForm, CategoryForm, TodoForm } from './components/index'
import Pages from './pages/index'
import './App.css'

function App() {
  const location = useLocation()
  const background = location.state && location.state.background
  const edit = location.state && location.state.edit

  return (
    <div className='pure-u-1'>
      <Navbar />
      <Switch location={background ? background : location}>
        {Pages.map((page, i) => (
          <Route exact path={page.path} key={i}>
            {page.component()}
          </Route>
        ))}
      </Switch>
      {background && (
        <>
          <Route exact path='/projects/new' children={<ProjectForm />} />
          <Route exact path='/categories/new' children={<CategoryForm />} />
          <Route exact path='/todos/new' children={<TodoForm />} />
          <Route
            exact
            path='/todos/:id/edit'
            children={<TodoForm edit={edit} />}
          />
          <Route
            exact
            path='/categories/:id/edit'
            children={<CategoryForm edit={edit} />}
          />
          <Route
            exact
            path='/projects/:id/edit'
            children={<ProjectForm edit={edit} />}
          />
        </>
      )}
    </div>
  )
}

export default App
