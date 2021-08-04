import categoryActions from './categories'
import todoActions from './todos'
import projectActions from './projects'
import coordinateActions from './coordinates'

const actions = {
  ...todoActions,
  ...categoryActions,
  ...projectActions,
  ...coordinateActions
}
export default actions
