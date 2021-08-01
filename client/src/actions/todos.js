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

const todoActions = {
  fetchTodo,
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteTodosByCategory
}

export default todoActions
