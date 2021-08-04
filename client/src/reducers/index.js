import { combineReducers } from 'redux'
import categories from './categories'
import todos from './todos'
import projects from './projects'
import coordinates from './coordinates'

const rootReducer = combineReducers({ categories, todos, projects, coordinates })

export default rootReducer
