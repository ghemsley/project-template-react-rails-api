const coordinates = (state = [], action) => {
  switch (action.type) {
    case 'REFRESH_COORDINATES':
      const coords = state.find(
        coords =>
          coords.type === action.payload.type &&
          coords.item.id === action.payload.item.id
      )
      if (coords && coords.position !== action.payload.position) {
        const newState = [...state]
        newState[newState.indexOf(coords)] = action.payload
        return newState
      }
      return [...state, action.payload]

    default:
      return state
  }
}

export default coordinates
