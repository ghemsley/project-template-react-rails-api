import CONSTANTS from '../constants'
import helpers from '../helpers'

const setToken = token => {
  const currentTime = new Date(Date.now()).getTime()
  localStorage.setItem('token', token)
  localStorage.setItem('lastLogin', currentTime.toString())
}

const getToken = () => {
  return localStorage.getItem('token')
}

const authenticateUser = payload => {
  return {
    type: CONSTANTS.ACTIONS.AUTHENTICATED,
    payload: {
      id: payload.user.data.attributes.id,
      username: payload.user.data.attributes.username,
      email: payload.user.data.attributes.email,
      createdAt: payload.user.data.attributes.created_at,
      signInCount: payload.user.data.attributes.sign_in_count,
      currentSignIn: payload.user.data.attributes.current_sign_in_at,
      lastSignIn: payload.user.data.attributes.last_sign_in_at,
      currentIP: payload.user.data.attributes.current_sign_in_ip,
      lastIP: payload.user.data.attributes.last_sign_in_ip
    }
  }
}

const unauthenticateUser = () => ({
  type: CONSTANTS.ACTIONS.UNAUTHENTICATED
})

const signupUser = credentials => dispatch =>
  fetch(`${CONSTANTS.URLS.BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: credentials })
  }).then(res => {
    if (res.ok) {
      setToken(res.headers.get('Authorization'))
      return helpers.convertIdToInt(res.json()).then(json => {
        dispatch(authenticateUser(json))
        return json
      })
    } else {
      return helpers.convertIdToInt(res.json()).then(error => {
        dispatch(unauthenticateUser())
        return Promise.reject(error)
      })
    }
  })

const loginUser = credentials => dispatch =>
  fetch(`${CONSTANTS.URLS.BASE_URL}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user: credentials })
  }).then(res => {
    if (res.ok) {
      setToken(res.headers.get('Authorization'))
      return helpers.convertIdToInt(res.json()).then(json => {
        dispatch(authenticateUser(json))
        return json
      })
    } else {
      return helpers.convertIdToInt(res.json()).then(error => {
        dispatch(unauthenticateUser())
        return Promise.reject(error)
      })
    }
  })

const logoutUser = () => dispatch =>
  fetch(`${CONSTANTS.URLS.BASE_URL}/logout`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: getToken()
    }
  }).then(res => {
    if (res.ok) {
      return helpers.convertIdToInt(res.json()).then(json => {
        dispatch(unauthenticateUser())
        return json
      })
    } else {
      return helpers.convertIdToInt(res.json()).then(error => {
        dispatch(unauthenticateUser())
        return Promise.reject(error)
      })
    }
  })

const checkAuth = () => dispatch =>
  fetch(`${CONSTANTS.URLS.BASE_URL}/current_user`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: getToken()
    }
  }).then(res => {
    if (res.ok) {
      return helpers.convertIdToInt(res.json()).then(json => {
        dispatch(authenticateUser(json))
        return json
      })
    } else {
      return helpers.convertIdToInt(res.json()).then(error => {
        dispatch(unauthenticateUser())
        return Promise.reject(error)
      })
    }
  })

const authenticationActions = {
  setToken,
  getToken,
  authenticateUser,
  unauthenticateUser,
  signupUser,
  loginUser,
  logoutUser,
  checkAuth
}

export default authenticationActions
