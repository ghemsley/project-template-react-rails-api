const categories = (state = [], action) => {
  const compareOrder = (category1, category2) => category1.order - category2.order
  let newState = []
  switch (action.type) {
    case 'CREATE_CATEGORY':
      console.log('creating category')
      return [...state, action.payload]

    case 'UPDATE_CATEGORY':
      console.log('updating category')
      newState = [...state]
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

    case 'UPDATE_CATEGORIES':
      console.log('batch updating categories')
      newState = [...state]
      for (const category of action.payload) {
        const currentCategory = newState.find(existing => existing.id === category.id)
        if (currentCategory) {
          for (const key in category) {
            if (key !== 'id') {
              currentCategory[key] = category[key]
            }
          }
        }
      }
      newState.sort(compareOrder)
      return newState

    case 'DELETE_CATEGORY':
      console.log('deleting category')
      return [...state.filter(category => category.id !== action.payload.id)]

    default:
      return state
  }
}

export default categories
