import helpers from './helpers'

const projects = (state = [], action) => {
  let newState = []
  let payload = null
  if (action.payload) {
    payload = helpers.convertIdToInt(action.payload)
  }
  switch (action.type) {
    case 'CREATE_PROJECT':
      if (
        !state.find(project => parseInt(project.id) === parseInt(payload.id))
      ) {
        return [...state, payload]
      } else return state

    case 'UPDATE_PROJECT':
      newState = [...state]
      const currentProject = newState.find(
        project => parseInt(project.id) === parseInt(payload.id)
      )
      if (currentProject) {
        for (const key in payload) {
          if (key !== 'id') {
            currentProject[key] = payload[key]
          }
        }
      }
      return newState

    case 'UPDATE_PROJECTS':
      newState = [...state]
      for (const project of payload) {
        const currentProject = newState.find(
          existing => parseInt(existing.id) === parseInt(project.id)
        )
        if (currentProject) {
          for (const key in project) {
            if (key !== 'id') {
              currentProject[key] = project[key]
            }
          }
        }
      }
      return newState

    case 'DELETE_PROJECT':
      return [
        ...state.filter(
          project => parseInt(project.id) !== parseInt(payload.id)
        )
      ]

    case 'RESET_PROJECTS':
      return []

    default:
      return state
  }
}

export default projects
