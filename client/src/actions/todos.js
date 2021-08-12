import actions from '.'
import CONSTANTS from '../constants'
import helpers from '../helpers'

const fetchTodo = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/todos/${payload.id}`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => helpers.convertIdToInt(response.json()))
    .catch(error => console.log(error))
}

const fetchTodos = () => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/todos`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => helpers.convertIdToInt(response.json()))
    .catch(error => console.log(error))
}

const sendTodo = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: actions.getToken()
    },
    body: JSON.stringify(payload)
  })
    .then(response => helpers.convertIdToInt(response.json()))
    .catch(error => console.log(error))
}

const patchTodo = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/todos/${payload.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: actions.getToken()
    },
    body: JSON.stringify(payload)
  })
    .then(response => helpers.convertIdToInt(response.json()))
    .catch(error => console.log(error))
}

const patchTodos = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/todos/batch_update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: actions.getToken()
    },
    body: JSON.stringify(payload)
  })
    .then(response => helpers.convertIdToInt(response.json()))
    .catch(error => console.log(error))
}

const destroyTodo = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/todos/${payload.id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => helpers.convertIdToInt(response.json()))
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

const updateTodos = payload => ({
  type: 'UPDATE_TODOS',
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

const instantiateTodo = payload => (dispatch, getState) => {
  const state = getState()
  return dispatch(sendTodo(payload)).then(json => {
    if (json.data) {
      if (
        !state.todos.find(todo => todo.id === json.data.id)
      ) {
        const todoObject = {
          id: json.data.id,
          name: json.data.attributes.name,
          description: json.data.attributes.description,
          categoryID: json.data.relationships.category.data.id,
          order: json.data.attributes.order
        }
        dispatch(createTodo(todoObject))
      }
    }

    return json
  })
}

const removeTodo = payload => dispatch => {
  dispatch(destroyTodo(payload)).then(json => {
    if (json.data) {
      dispatch(deleteTodo(payload))
    }
    return json
  })
}

const amendTodo = payload => dispatch => {
  return patchTodo(payload).then(json => {
    if (json.data) {
      dispatch(updateTodo(payload))
    }
    return json
  })
}

const batchAmendTodos = payload => dispatch => {
  return dispatch(patchTodos(payload)).then(json => {
    dispatch(updateTodos(payload))
    return json
  })
}

const todoActions = {
  fetchTodo,
  fetchTodos,
  sendTodo,
  createTodo,
  updateTodo,
  updateTodos,
  deleteTodo,
  deleteTodosByCategory,
  instantiateTodo,
  destroyTodo,
  removeTodo,
  patchTodo,
  amendTodo,
  batchAmendTodos
}

export default todoActions
