import constants from '../constants'

const fetchTodo = payload => () => {
  return fetch(`${constants.urls.BASE_URL}/todos/${payload.id}`, {
    headers: { Accept: 'application/json' }
  }).then(response => response.json())
}

const fetchTodos = () => () => {
  return fetch(`${constants.urls.BASE_URL}/todos`, {
    headers: { Accept: 'application/json' }
  }).then(response => response.json())
}

const sendTodo = payload => () => {
  return fetch(`${constants.urls.BASE_URL}/todos`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  }).then(response => response.json())
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

const destroyTodo = payload => () => {
  console.log('destroying todo')
  return fetch(`${constants.urls.BASE_URL}/todos/${payload.id}`, {
    method: 'delete',
    headers: { Accept: 'application/json' }
  }).then(response => response.json())
}

const removeTodo = payload => dispatch => {
  console.log('removing todo')
  dispatch(destroyTodo(payload)).then((json) => {
    if (json.data.id === payload.id) {
      dispatch(deleteTodo(payload))
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
  removeTodo
}

export default todoActions
