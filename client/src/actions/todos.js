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
      projectID: json.data.relationships.category.data.id
    }
    dispatch(createTodo(todoObject))
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
  instantiateTodo
}

export default todoActions
