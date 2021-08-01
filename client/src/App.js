import { Route, Switch, useLocation } from 'react-router-dom'
import { Navbar, ProjectForm, CategoryForm, TodoForm } from './components/index'
import Pages from './pages/index'
import './App.css'

function App() {
  const location = useLocation()
  const background = location.state && location.state.background

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
          <Route exact path={`/projects/new`} children={<ProjectForm />} />
          <Route exact path={`/categories/new`} children={<CategoryForm />} />
          <Route exact path={`/todos/new`} children={<TodoForm />} />
        </>
      )}
    </div>
  )
}

export default App
