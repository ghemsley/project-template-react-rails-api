const refreshCoordinates = payload => ({
  type: 'REFRESH_COORDINATES',
  payload
})

const deleteCoordinates = payload => ({
  type: 'DELETE_COORDINATES',
  payload
})

const coordinateActions = {
  refreshCoordinates,
  deleteCoordinates
}

export default coordinateActions
