import helpers from '../helpers'

const categories = (state = [], action) => {
  let newState = []
  let payload = null
  if (action.payload) {
    payload = helpers.convertIdToInt(action.payload)
  }
  switch (action.type) {
    case 'CREATE_CATEGORY':
      if (!state.find(cat => cat.id === payload.id)) {
        return [...state, payload]
      } else return state

    case 'UPDATE_CATEGORY':
      newState = [...state]
      const currentCategory = newState.find(category => category.id === payload.id)
      if (currentCategory) {
        for (const key in payload) {
          if (key !== 'id') {
            currentCategory[key] = payload[key]
          }
        }
      }
      return newState

    case 'UPDATE_CATEGORIES':
      newState = [...state]
      for (const category of payload) {
        const currentCategory = newState.find(existing => existing.id === category.id)
        if (currentCategory) {
          for (const key in category) {
            if (key !== 'id') {
              currentCategory[key] = category[key]
            }
          }
        }
      }
      return newState

    case 'DELETE_CATEGORY':
      return [...state.filter(category => category.id !== payload.id)]

    default:
      return state
  }
}

export default categories
