import CONSTANTS from '../constants'

const setToken = token => {
  const currentTime = new Date(Date.now()).getTime()
  localStorage.setItem('token', token)
  localStorage.setItem('lastLogin', currentTime.toString())
}

const getToken = () => {
  const currentTime = new Date(Date.now()).getTime()
  const timeSinceLastLogin =
    currentTime - parseInt(localStorage.getItem('lastLogin'))
  if (timeSinceLastLogin < CONSTANTS.AUTHENTICATION.THIRTY_MINUTES) {
    return localStorage.getItem('token')
  }
}

const authenticateUser = payload => {
  console.log(payload)
  return {
    type: CONSTANTS.ACTIONS.AUTHENTICATED,
    payload: {
      id: payload.data.data.attributes.id,
      username: payload.data.data.attributes.username,
      email: payload.data.data.attributes.email,
      createdAt: payload.data.data.attributes.created_at,
      signInCount: payload.data.data.attributes.sign_in_count,
      currentSignIn: payload.data.data.attributes.current_sign_in_at,
      lastSignIn: payload.data.data.attributes.last_sign_in_at,
      currentIP: payload.data.data.attributes.current_sign_in_ip,
      lastIP: payload.data.data.attributes.last_sign_in_ip
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
      return res.json().then(json => {
        dispatch(authenticateUser(json))
        return json
      })
    } else {
      return res.json().then(error => {
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
      return res.json().then(json => {
        dispatch(authenticateUser(json))
        return json
      })
    } else {
      return res.json().then(error => {
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
      return res.json().then(json => {
        dispatch(unauthenticateUser())
        return json
      })
    } else {
      return res.json().then(error => {
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
      return res.json().then(json => {
        dispatch(authenticateUser(json))
        return json
      })
    } else {
      return res.json().then(error => {
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
