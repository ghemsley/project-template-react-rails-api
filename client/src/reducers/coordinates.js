import helpers from '../helpers'

const coordinates = (state = [], action) => {
  let payload = null
  if (action.payload) {
    payload = helpers.convertIdToInt(action.payload)
  }
  const newState = [...state]
  switch (action.type) {
    case 'REFRESH_COORDINATES':
      const coords = state.find(
        coords => coords.type === payload.type && coords.item.id === payload.item.id
      )
      if (coords && coords.position !== payload.position) {
        newState[newState.indexOf(coords)] = payload
        return newState
      } else if (!coords) {
        return [...newState, payload]
      } else {
        return state
      }

    case 'DELETE_COORDINATES':
      const coordinate = newState.find(
        coord => coord.item.id === payload.item.id && coord.type === payload.type
      )
      if (coordinate) {
        return newState.splice(newState.indexOf(coordinate), 1)
      } else return state

    default:
      return state
  }
}

export default coordinates
