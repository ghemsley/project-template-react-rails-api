import { createSelector, createIdSelector } from 'redux-views'

const selectCoordinates = state => state.coordinates

const selectAcceptType = createIdSelector(props => props.acceptType)

const selectParentType = createIdSelector(props => props.parentType)

const selectParentId = createIdSelector(props => props.parentID)

const filterCoordinates = (coordinates, acceptType, parentType, parentID) =>
  coordinates
    .filter(
      coords =>
        coords.type === acceptType &&
        coords.item[`${parentType}ID`] === parentID
    )
    .sort((coords1, coords2) => coords1.item.order - coords2.item.order)

export const makeSelectChildCoordinates = createSelector(
  [selectCoordinates, selectAcceptType, selectParentType, selectParentId],
  filterCoordinates
)

const coordinates = { makeSelectChildCoordinates }

export default coordinates
