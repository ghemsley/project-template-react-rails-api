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
      console.log('creating todo')
      newState = [...state, payload]
      newState.sort(compareOrder)
      return newState

    case 'UPDATE_TODO':
      console.log('updating todo')
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
      console.log('batch updating todos')
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
      console.log('deleting todo')
      newState = [...state.filter(todo => todo.id !== payload.id)]
      newState.sort(compareOrder)
      return newState

    case 'DELETE_TODOS_BY_CATEGORY':
      console.log('deleting newState by category')
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
