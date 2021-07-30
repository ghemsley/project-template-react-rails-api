import { combineReducers } from 'redux'
import categories from './categories'
import todos from './todos'
import interactions from './interactions'
import projects from './projects'

const rootReducer = combineReducers({ categories, todos, interactions, projects })

export default rootReducer
