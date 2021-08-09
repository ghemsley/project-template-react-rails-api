import helpers from './helpers'

const userProjects = (state = [], action) => {
  let payload = null
  if (action.payload) {
    payload = helpers.convertIdToInt(action.payload)
  }
  switch (action.type) {
    case 'CREATE_USER_PROJECT':
      return [...state, payload]

    case 'DELETE_USER_PROJECT':
      return [...state.filter(userProject => userProject.id !== payload.id)]

    default:
      return state
  }
}

export default userProjects
