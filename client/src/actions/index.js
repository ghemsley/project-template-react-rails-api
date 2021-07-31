import categoryActions from './categories'
import todoActions from './todos'
import projectActions from './projects'

const actions = { ...todoActions, ...categoryActions, ...projectActions }
export default actions
