import {v4 as uuid} from 'uuid'

const projects = (state = [], action) => {
  switch (action.type) {
    case 'CREATE_PROJECT':
      console.log('creating project')
      return [
        ...state,
        {
          ...action.payload,
          id: uuid()
        }
      ]

    case 'UPDATE_PROJECT':
      console.log('updating project')
      const newState = [...state]
      const currentProject = newState.find(
        project => project.id === action.payload.id
      )
      if (currentProject) {
        for (const key in action.payload) {
          if (key !== 'id') {
            currentProject[key] = action.payload[key]
          }
        }
      }
      return newState

    case 'DELETE_PROJECT':
      console.log('deleting project')
      return [...state.filter(project => project.id !== action.payload.id)]

    default:
      return state
  }
}

export default projects
