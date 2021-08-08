import { combineReducers } from 'redux'
import categories from './categories'
import todos from './todos'
import projects from './projects'
import coordinates from './coordinates'
import authentication from './authentication'
import userProjects from './userProjects'

const rootReducer = combineReducers({ categories, todos, projects, coordinates, authentication, userProjects })

export default rootReducer
