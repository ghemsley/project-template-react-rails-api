import CONSTANTS from '../constants'
import helpers from '../helpers'

const setToken = token => {
  localStorage.setItem('token', token)
}

const getToken = () => {
  const token = localStorage.getItem('token')
  return token ? token : ''
}

const deleteToken = () => {
  localStorage.removeItem('token')
}

const signup = credentials => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: credentials }),
  }).then(res => {
    if (res.ok) {
      setToken(res.headers.get('Authorization'))
      return helpers.convertIdToInt(res.json())
    } else {
      return helpers.convertIdToInt(res.json()).then(error => Promise.reject(error))
    }
  })
}

const login = credentials =>
  fetch(`${CONSTANTS.URLS.BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: credentials }),
  }).then(res => {
    if (res.ok) {
      setToken(res.headers.get('Authorization'))
      return helpers.convertIdToInt(res.json())
    } else {
      return helpers.convertIdToInt(res.json()).then(error => Promise.reject(error))
    }
  })

const logout = () =>
  fetch(`${CONSTANTS.URLS.BASE_URL}/logout`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getToken(),
    },
  }).then(res => {
    if (res.ok) {
      return helpers.convertIdToInt(res.json())
    } else {
      return helpers.convertIdToInt(res.json()).then(error => Promise.reject(error))
    }
  })

const authorize = () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/current_user`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': getToken(),
    },
  }).then(res => {
    if (res.ok) {
      return helpers.convertIdToInt(res.json())
    } else {
      return helpers.convertIdToInt(res.json()).then(error => Promise.reject(error))
    }
  })
}

const setAuthenticated = payload => dispatch =>
  Promise.resolve(
    dispatch({
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
        lastIP: payload.user.data.attributes.last_sign_in_ip,
      },
    })
  )

const setUnauthenticated = () => dispatch =>
  Promise.resolve(dispatch({ type: CONSTANTS.ACTIONS.UNAUTHENTICATED }))

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
      lastIP: payload.user.data.attributes.last_sign_in_ip,
    },
  }
}

const unauthenticateUser = () => ({
  type: CONSTANTS.ACTIONS.UNAUTHENTICATED,
})

const signupUser = credentials => dispatch =>
  signup(credentials)
    .then(json => {
      dispatch(authenticateUser(json))
      return json
    })
    .catch(error => {
      dispatch(unauthenticateUser())
      return Promise.reject(error)
    })

const loginUser = credentials => dispatch =>
  login(credentials)
    .then(json => {
      dispatch(authenticateUser(json))
      return json
    })
    .catch(error => {
      dispatch(unauthenticateUser())
      return Promise.reject(error)
    })

const logoutUser = () => dispatch =>
  logout()
    .then(json => {
      dispatch(unauthenticateUser())
      return json
    })
    .catch(error => {
      dispatch(unauthenticateUser())
      return Promise.reject(error)
    })

const checkAuth = () => dispatch =>
  authorize()
    .then(json => {
      dispatch(authenticateUser(json))
      return json
    })
    .catch(error => {
      dispatch(unauthenticateUser())
      return Promise.reject(error)
    })

const authenticationActions = {
  setToken,
  getToken,
  deleteToken,
  authenticateUser,
  unauthenticateUser,
  signupUser,
  loginUser,
  logoutUser,
  checkAuth,
  setAuthenticated,
  setUnauthenticated,
}

export default authenticationActions
