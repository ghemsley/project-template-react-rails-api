import userProjects from './userProjects'
import projects from './projects'
import categories from './categories'
import todos from './todos'
import coordinates from './coordinates'

const selectors = {
  ...userProjects,
  ...projects,
  ...categories,
  ...todos,
  ...coordinates
}

export default selectors
