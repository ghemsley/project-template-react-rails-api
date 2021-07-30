const addCategoryCoordinates = payload => ({
  type: 'ADD_CATEGORY_COORDINATES',
  payload
})

const refreshCategoryCoordinates = payload => ({
  type: 'REFRESH_CATEGORY_COORDINATES',
  payload
})

const updateCategoryCoordinates = payload => (dispatch, getState) => {
  console.log('updating category coordinates')
  const coordinates = getState().interactions.categoryCoordinates
  const found = coordinates.find(
    coordinate => coordinate.id === payload.coordinates.id
  )
  if (!found) {
    dispatch(addCategoryCoordinates(payload))
  } else {
    dispatch(refreshCategoryCoordinates(payload))
  }
}

const addProjectCoordinates = payload => ({
  type: 'ADD_PROJECT_COORDINATES',
  payload
})

const refreshProjectCoordinates = payload => ({
  type: 'REFRESH_PROJECT_COORDINATES',
  payload
})

const updateProjectCoordinates = payload => (dispatch, getState) => {
  console.log('updating project coordinates')
  const coordinates = getState().interactions.projectCoordinates
  const found = coordinates.find(
    coordinates => coordinates.id === payload.coordinates.id
  )
  if (!found) {
    dispatch(addProjectCoordinates(payload))
  } else {
    dispatch(refreshProjectCoordinates(payload))
  }
}

const updateTodoAssociation = payload => (dispatch, getState) => {
  console.log('updating todo association')
  const coordinates = getState().interactions.categoryCoordinates
  coordinates.forEach(coordinate => {
    if (
      coordinate.id !== payload.todo.categoryID &&
      coordinate.left <= payload.left &&
      coordinate.right >= payload.left &&
      coordinate.top <= payload.top &&
      coordinate.bottom >= payload.top
    ) {
      dispatch({
        type: 'UPDATE_TODO',
        payload: { ...payload.todo, categoryID: coordinate.id }
      })
    }
  })
}

const updateCategoryAssociation = payload => (dispatch, getState) => {
  console.log('updating category association')
  const coordinates = getState().interactions.projectCoordinates
  coordinates.forEach(coordinate => {
    if (
      coordinate.id !== payload.category.projectID &&
      coordinate.left <= payload.left &&
      coordinate.right >= payload.left &&
      coordinate.top <= payload.top &&
      coordinate.bottom >= payload.top
    ) {
      dispatch({
        type: 'UPDATE_CATEGORY',
        payload: { ...payload.category, projectID: coordinate.id }
      })
    }
  })
}

const interactionActions = {
  addCategoryCoordinates,
  refreshCategoryCoordinates,
  updateCategoryCoordinates,
  addProjectCoordinates,
  refreshProjectCoordinates,
  updateProjectCoordinates,
  updateTodoAssociation,
  updateCategoryAssociation
}

export default interactionActions
