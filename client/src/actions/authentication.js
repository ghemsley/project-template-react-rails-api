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

const authenticateUser = payload => ({
  type: CONSTANTS.ACTIONS.AUTHENTICATED,
  payload
})

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
      return res.json().then(json => dispatch(authenticateUser(json)))
    } else {
      return res.json().then(error => {
        dispatch(unauthenticateUser())
        Promise.reject(error)
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
      return res.json().then(json =>
        dispatch({
          type: CONSTANTS.ACTIONS.AUTHENTICATED,
          payload: json.data
        })
      )
    } else {
      return res.json().then(error => {
        dispatch({ type: CONSTANTS.ACTIONS.UNAUTHENTICATED })
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
      return dispatch({ type: CONSTANTS.ACTIONS.UNAUTHENTICATED })
    } else {
      return res.json().then(error => {
        dispatch({ type: CONSTANTS.ACTIONS.UNAUTHENTICATED })
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
      return res.json().then(json =>
        dispatch({
          type: CONSTANTS.ACTIONS.AUTHENTICATED,
          payload: {
            id: json.data.attributes.id,
            username: json.data.attributes.username,
            email: json.data.attributes.email,
            createdAt: json.data.attributes.created_at,
            signInCount: json.data.attributes.sign_in_count,
            currentSignIn: json.data.attributes.current_sign_in_at,
            lastSignIn: json.data.attributes.last_sign_in_at,
            currentIP: json.data.attributes.current_sign_in_ip,
            lastIP: json.data.attributes.last_sign_in_ip
          }
        })
      )
    } else {
      return Promise.reject(
        dispatch({ type: CONSTANTS.ACTIONS.UNAUTHENTICATED })
      )
    }
  })

const authenticationActions = { setToken, getToken, authenticateUser, unauthenticateUser, signupUser, loginUser, logoutUser, checkAuth }

export default authenticationActions
