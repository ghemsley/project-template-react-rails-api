import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/index'
import Pages from './pages/index'

function App() {
  return (
    <Router>
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
    </Router>
  )
}

export default App
