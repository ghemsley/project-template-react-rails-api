import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import './App.css'
import { Navbar } from './components/index'
import Pages from './pages/index'

function App() {
  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <div className='pure-u-1'>
          <Navbar />
          <Switch>
            {Pages.map((page, i) => (
              <Route exact path={page.path} key={i}>
                {page.component()}
              </Route>
            ))}
          </Switch>
        </div>
      </DndProvider>
    </Router>
  )
}

export default App
