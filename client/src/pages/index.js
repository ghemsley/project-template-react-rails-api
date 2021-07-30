import Home from './Home'
import Categories from './Categories'
import Todos from './Todos'
import Projects from './Projects'

const Pages = [
  { name: 'Home', component: Home, path: '/' },
  { name: 'Projects', component: Projects, path: '/projects' },
  { name: 'Categories', component: Categories, path: '/categories' },
  { name: 'Todos', component: Todos, path: '/todos' }
]

export { Home, Projects, Categories, Todos }
export default Pages
