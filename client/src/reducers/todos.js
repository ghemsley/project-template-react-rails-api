const todos = (state = [], action) => {
  const compareOrder = (todo1, todo2) => todo1.order - todo2.order
  let newState = []
  switch (action.type) {
    case 'CREATE_TODO':
      console.log('creating todo')
      newState = [...state, action.payload]
      newState.sort(compareOrder)
      return newState

    case 'UPDATE_TODO':
      console.log('updating todo')
      newState = [...state]
      const currentTodo = newState.find(todo => todo.id === action.payload.id)
      if (currentTodo) {
        for (const key in action.payload) {
          if (key !== 'id') {
            currentTodo[key] = action.payload[key]
          }
        }
      }
      newState.sort(compareOrder)
      return newState

    case 'UPDATE_TODOS':
      console.log('batch updating todos')
      newState = [...state, ...action.payload]
      newState.sort(compareOrder)
      return newState

    case 'DELETE_TODO':
      console.log('deleting todo')
      newState = [...state.filter(todo => todo.id !== action.payload.id)]
      newState.sort(compareOrder)
      return newState

    case 'DELETE_TODOS_BY_CATEGORY':
      console.log('deleting newState by category')
      newState = [
        ...state.filter(todo => todo.categoryID !== action.payload.id)
      ]
      newState.sort(compareOrder)
      return newState

    default:
      return state
  }
}

export default todos
