import Home from './Home'
import Categories from './Categories'
import Todos from './Todos'
import Projects from './Projects'

const Pages = [
  { name: 'Home', component: Home, path: '/', protected: false },
  { name: 'Projects', component: Projects, path: '/projects', protected: true },
  {
    name: 'Categories',
    component: Categories,
    path: '/categories',
    protected: true
  },
  { name: 'Todos', component: Todos, path: '/todos', protected: true }
]

export { Home, Projects, Categories, Todos }
export default Pages
