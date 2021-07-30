const createTodo = (payload) => ({
  type: 'CREATE_TODO',
  payload
})

const updateTodo = (payload) => ({
  type: 'UPDATE_TODO',
  payload
})

const deleteTodo = (payload) => ({
  type: 'DELETE_TODO',
  payload
})

const deleteTodosByCategory = (payload) => ({
  type: 'DELETE_TODOS_BY_CATEGORY',
  payload
})

const todoActions = { createTodo, updateTodo, deleteTodo, deleteTodosByCategory }

export default todoActions
