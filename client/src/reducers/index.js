import { combineReducers } from 'redux'
import categories from './categories'
import todos from './todos'
import projects from './projects'

const rootReducer = combineReducers({ categories, todos, projects })

export default rootReducer
