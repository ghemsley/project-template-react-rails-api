import CONSTANTS from '../constants'

const convertIdToInt = object => {
  for (const key in object) {
    if (
      new Set([
        'id',
        'categoryID',
        'category_id',
        'projectID',
        'project_id',
        'userID',
        'user_id',
        'order',
      ]).has(key) &&
      typeof object[key] === 'string'
    ) {
      try {
        object[key] = parseInt(object[key])
      } catch (e) {
        console.error(e)
      }
    } else if (typeof object[key] === 'object') {
      try {
        convertIdToInt(object[key])
      } catch (e) {
        console.error(e)
      }
    }
  }
  return object
}

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

const fetcher = (url, method, auth, body) => {
  const token = auth ? helpers.getToken() : null
  return fetch(CONSTANTS.URLS.BASE_URL + url, {
    method,
    headers:
      auth && token
        ? new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token,
          })
        : new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }),
    body: body ? JSON.stringify(body) : undefined,
  })
    .then(response => {
      const token = response.headers.get('Authorization')
      if (token) setToken(token)
      return response.json()
    })
    .catch(error => error)
}

const variants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
  out: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
}

const helpers = { convertIdToInt, getToken, setToken, deleteToken, fetcher, variants }

export default helpers
