import categoryActions from './categories'
import todoActions from './todos'
import projectActions from './projects'
import coordinateActions from './coordinates'
import authenticationActions from './authentication'

const actions = {
  ...todoActions,
  ...categoryActions,
  ...projectActions,
  ...coordinateActions,
  ...authenticationActions
}
export default actions
