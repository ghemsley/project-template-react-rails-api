import categoryActions from './categories'
import todoActions from './todos'
import projectActions from './projects'
import coordinateActions from './coordinates'
import authenticationActions from './authentication'
import userProjectActions from './userProjects'

const actions = {
  ...todoActions,
  ...categoryActions,
  ...projectActions,
  ...coordinateActions,
  ...authenticationActions,
  ...userProjectActions,
}
export default actions
