import { combineReducers } from 'redux'
import categories from './categories'
import todos from './todos'
import projects from './projects'
import coordinates from './coordinates'
import authentication from './authentication'

const rootReducer = combineReducers({ categories, todos, projects, coordinates, authentication })

export default rootReducer
