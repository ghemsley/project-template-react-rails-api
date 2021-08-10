import helpers from './helpers'

const todos = (state = [], action) => {
  let newState = []
  let payload = null
  if (action.payload) {
    payload = helpers.convertIdToInt(action.payload)
  }
  switch (action.type) {
    case 'CREATE_TODO':
      if (!state.find(todo => parseInt(todo.id) === parseInt(payload.id))) {
        return [...state, payload]
      } else return state

    case 'UPDATE_TODO':
      newState = [...state]
      const currentTodo = newState.find(todo => todo.id === payload.id)
      if (currentTodo) {
        for (const key in payload) {
          if (key !== 'id') {
            currentTodo[key] = payload[key]
          }
        }
      }
      return newState

    case 'UPDATE_TODOS':
      newState = [...state]
      for (const todo of payload) {
        const currentTodo = newState.find(existing => existing.id === todo.id)
        if (currentTodo) {
          for (const key in todo) {
            if (key !== 'id') {
              currentTodo[key] = todo[key]
            }
          }
        }
      }
      return newState

    case 'DELETE_TODO':
      newState = [...state.filter(todo => todo.id !== payload.id)]
      return newState

    case 'DELETE_TODOS_BY_CATEGORY':
      newState = [...state.filter(todo => todo.categoryID !== payload.id)]
      return newState

    default:
      return state
  }
}

export default todos
