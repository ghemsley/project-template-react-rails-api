import CONSTANTS from '../constants'
import helpers from './helpers'

const authentication = (
  state = { authChecked: false, loggedIn: false, currentUser: {} },
  action
) => {
  let payload = null
  if (action.payload) {
    payload = helpers.convertIdToInt(action.payload)
  }
  switch (action.type) {
    case CONSTANTS.ACTIONS.AUTHENTICATED:
      return {
        authChecked: true,
        loggedIn: true,
        currentUser: payload
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
