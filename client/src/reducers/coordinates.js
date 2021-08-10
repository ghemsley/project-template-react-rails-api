import helpers from './helpers'

const coordinates = (state = [], action) => {
  let payload = null
  if (action.payload) {
    payload = helpers.convertIdToInt(action.payload)
  }
  switch (action.type) {
    case 'REFRESH_COORDINATES':
      const coords = state.find(
        coords =>
          coords.type === payload.type &&
          parseInt(coords.item.id) === parseInt(payload.item.id)
      )
      if (coords && coords.position !== payload.position) {
        const newState = [...state]
        newState[newState.indexOf(coords)] = payload
        return newState
      }
      return [...state, payload]

    default:
      return state
  }
}

export default coordinates
