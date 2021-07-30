import interactionActions from './interactions'
import categoryActions from './categories'
import todoActions from './todos'
import projectActions from './projects'

const actions = { ...todoActions, ...categoryActions, ...interactionActions, ...projectActions }
export default actions
