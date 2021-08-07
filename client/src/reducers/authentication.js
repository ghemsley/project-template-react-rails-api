import CONSTANTS from '../constants'

const authentication = (
  state = { authChecked: false, loggedIn: false, currentUser: {} },
  action
) => {
  switch (action.type) {
    case CONSTANTS.ACTIONS.AUTHENTICATED:
      return {
        authChecked: true,
        loggedIn: true,
        currentUser: action.payload
      }
    case CONSTANTS.ACTIONS.UNAUTHENTICATED:
      return {
        authChecked: true,
        loggedIn: false,
        currentUser: {}
      }
    default:
      return state
  }
}

export default authentication
