import helpers from './helpers'

const userProjects = (state = [], action) => {
  let payload = null
  if (action.payload) {
    payload = helpers.convertIdToInt(action.payload)
  }
  switch (action.type) {
    case 'CREATE_USER_PROJECT':
      if (
        !state.find(
          userProj =>
            parseInt(userProj.id) === parseInt(payload.id) &&
            !(
              parseInt(userProj.projectID) === parseInt(payload.projectID) &&
              parseInt(userProj.userID) === parseInt(payload.userID)
            )
        )
      ) {
        return [...state, payload]
      } else return state

    case 'DELETE_USER_PROJECT':
      return [
        ...state.filter(
          userProject => parseInt(userProject.id) !== parseInt(payload.id)
        )
      ]

    default:
      return state
  }
}

export default userProjects
