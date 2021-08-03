import constants from '../constants'

const fetchTodo = payload => () => {
  return fetch(`${constants.urls.BASE_URL}/todos/${payload.id}`, {
    headers: { Accept: 'application/json' }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const fetchTodos = () => () => {
  return fetch(`${constants.urls.BASE_URL}/todos`, {
    headers: { Accept: 'application/json' }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const sendTodo = payload => () => {
  return fetch(`${constants.urls.BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const patchTodo = payload => () => {
  return fetch(`${constants.urls.BASE_URL}/todos/${payload.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const destroyTodo = payload => () => {
  console.log('destroying todo')
  return fetch(`${constants.urls.BASE_URL}/todos/${payload.id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const createTodo = payload => ({
  type: 'CREATE_TODO',
  payload
})

const updateTodo = payload => ({
  type: 'UPDATE_TODO',
  payload
})

const deleteTodo = payload => ({
  type: 'DELETE_TODO',
  payload
})

const deleteTodosByCategory = payload => ({
  type: 'DELETE_TODOS_BY_CATEGORY',
  payload
})

const instantiateTodo = payload => dispatch => {
  console.log('instantiating todo')
  return dispatch(sendTodo(payload)).then(json => {
    const todoObject = {
      id: json.data.id,
      name: json.data.attributes.name,
      description: json.data.attributes.description,
      categoryID: json.data.relationships.category.data.id
    }
    dispatch(createTodo(todoObject))
  })
}

const removeTodo = payload => dispatch => {
  console.log('removing todo')
  dispatch(destroyTodo(payload)).then(json => {
    if (json.data.id === payload.id) {
      dispatch(deleteTodo(payload))
    }
  })
}

const amendTodo = payload => dispatch => {
  console.log('amending todo')
  return dispatch(patchTodo(payload)).then(json => {
    if (json.data.id === payload.id) {
      dispatch(updateTodo(payload))
    }
  })
}

const todoActions = {
  fetchTodo,
  fetchTodos,
  sendTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteTodosByCategory,
  instantiateTodo,
  destroyTodo,
  removeTodo,
  patchTodo,
  amendTodo
}

export default todoActions
