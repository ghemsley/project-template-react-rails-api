import uuid from 'uuid'
const todos = (state = [], action) => {
  switch (action.type) {
    case 'CREATE_TODO':
      console.log('creating todo')
      return [...state, { ...action.payload, id: uuid() }]

    case 'UPDATE_TODO':
      console.log('updating todo')
      const newState = [...state]
      const currentTodo = newState.find((todo) => todo.id === action.payload.id)
      console.log(currentTodo)
      if (currentTodo) {
        for (const key in action.payload) {
          if (key !== 'id') {
            currentTodo[key] = action.payload[key]
          }
        }
      }
      return newState

    case 'DELETE_TODO':
      console.log('deleting todo')
      return [...state.filter((todo) => todo.id !== action.payload.id)]

    case 'DELETE_TODOS_BY_CATEGORY':
      console.log('deleting todos by category')
      return [...state.filter((todo) => todo.categoryID !== action.payload.id)]

    default:
      return state
  }
}

export default todos
