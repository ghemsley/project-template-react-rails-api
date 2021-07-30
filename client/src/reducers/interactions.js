const interactions = (
  state = { categoryCoordinates: [], projectCoordinates: [] },
  action
) => {
  switch (action.type) {
    case 'ADD_CATEGORY_COORDINATES':
      return (() => {
        console.log('adding category coordinates')
        return !state.categoryCoordinates.find(
          coordinates => coordinates.id === action.payload.coordinates.id
        )
          ? {
              ...state,
              categoryCoordinates: [
                ...state.categoryCoordinates,
                action.payload.coordinates
              ]
            }
          : state
      })()

    case 'REFRESH_CATEGORY_COORDINATES':
      return (() => {
        console.log('refreshing category coordinates')
        const coordinates = [...state.categoryCoordinates]
        const currentCoordinates = coordinates.find(
          coordinates => coordinates.id === action.payload.coordinates.id
        )
        if (currentCoordinates) {
          const index = coordinates.indexOf(currentCoordinates)
          coordinates.splice(index, 1, action.payload.coordinates)
        }
        return { ...state, categoryCoordinates: coordinates }
      })()

    case 'ADD_PROJECT_COORDINATES':
      return (() => {
        console.log('adding project coordinates')
        return state.projectCoordinates.filter(
          coordinates => coordinates.id === action.payload.coordinates.id
        ).length === 0
          ? {
              ...state,
              projectCoordinates: [
                ...state.projectCoordinates,
                action.payload.coordinates
              ]
            }
          : state
      })()

    case 'REFRESH_PROJECT_COORDINATES':
      return (() => {
        console.log('refreshing project coordinates')
        const coordinates = [...state.projectCoordinates]
        const currentCoordinates = coordinates.find(
          coordinates => coordinates.id === action.payload.coordinates.id
        )
        if (currentCoordinates) {
          const index = coordinates.indexOf(currentCoordinates)
          coordinates.splice(index, 1, action.payload.coordinates)
        }
        return { ...state, projectCoordinates: coordinates }
      })()

    default:
      return state
  }
}

export default interactions
