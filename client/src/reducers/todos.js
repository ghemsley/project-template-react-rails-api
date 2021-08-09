import helpers from './helpers'

const todos = (state = [], action) => {
  const compareOrder = (todo1, todo2) => todo1.order - todo2.order
  let newState = []
  let payload = null
  if (action.payload) {
    payload = helpers.convertIdToInt(action.payload)
  }
  switch (action.type) {
    case 'CREATE_TODO':
      newState = [...state, payload]
      newState.sort(compareOrder)
      return newState

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
      newState.sort(compareOrder)
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
      newState.sort(compareOrder)
      return newState

    case 'DELETE_TODO':
      newState = [...state.filter(todo => todo.id !== payload.id)]
      newState.sort(compareOrder)
      return newState

    case 'DELETE_TODOS_BY_CATEGORY':
      newState = [
        ...state.filter(todo => todo.categoryID !== payload.id)
      ]
      newState.sort(compareOrder)
      return newState

    default:
      return state
  }
}

export default todos
