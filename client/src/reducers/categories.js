import { v4 as uuid } from 'uuid'

const categories = (state = [], action) => {
  switch (action.type) {
    case 'CREATE_CATEGORY':
      console.log('creating category')
      return [
        ...state,
        {
          ...action.payload,
          id: uuid()
        }
      ]

    case 'UPDATE_CATEGORY':
      console.log('updating category')
      const newState = [...state]
      const currentCategory = newState.find(
        category => category.id === action.payload.id
      )
      if (currentCategory) {
        for (const key in action.payload) {
          if (key !== 'id') {
            currentCategory[key] = action.payload[key]
          }
        }
      }
      return newState

    case 'DELETE_CATEGORY':
      console.log('deleting category')
      return [...state.filter(category => category.id !== action.payload.id)]

    default:
      return state
  }
}

export default categories
