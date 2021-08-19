import { createSelector } from 'redux-views'
import { selectId, selectCurrentUserId } from './helpers'

export const selectUserProjects = state => state.userProjects

const findUserProjectByCurrentUserIDAndProjectId = (
  userProjects,
  currentUserID,
  projectID
) => {
  return userProjects.find(
    userProj =>
      userProj.userID === currentUserID && userProj.projectID === projectID
  )
}

const makeSelectUserProjectByCurrentUserAndProjectId = createSelector(
  [selectUserProjects, selectCurrentUserId, selectId],
  findUserProjectByCurrentUserIDAndProjectId
)

const userProjects = { makeSelectUserProjectByCurrentUserAndProjectId }

export default userProjects
