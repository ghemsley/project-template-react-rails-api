import { createSelector } from 'redux-views'
import { selectId, selectCurrentUserId } from './helpers'
import { selectUserProjects } from './userProjects'

const selectProjects = state => state.projects

const findProjectById = (projects, projectID) =>
  projects.find(project => project.id === projectID)

const dedupProjects = projects => {
  const deduplicatedProjects = []
  for (const project of projects) {
    if (
      !project.private &&
      !deduplicatedProjects.find(proj => proj.id === project.id)
    ) {
      deduplicatedProjects.push(project)
    }
  }
  return deduplicatedProjects
}

const filterProjectsByCurrentUserId = (
  projects,
  userProjects,
  currentUserID
) => {
  const currentUserUserProjects = userProjects.filter(
    userProj => userProj.userID === currentUserID
  )
  const currentUserProjects = []
  for (const userProject of currentUserUserProjects) {
    const foundProject = projects.find(
      proj => proj.id === userProject.projectID
    )
    if (
      foundProject &&
      !currentUserProjects.find(proj => proj.id === foundProject.id)
    ) {
      currentUserProjects.push(foundProject)
    }
  }
  return currentUserProjects
}

const findFirstProjectIDByCurrentUserId = (
  projects,
  userProjects,
  currentUserID
) => {
  const currentUserUserProjects = userProjects.filter(
    userProj => userProj.userID === currentUserID
  )
  const currentUserProjects = projects.filter(project =>
    currentUserUserProjects
      .map(userProj => userProj.projectID)
      .includes(project.id)
  )
  return currentUserProjects[0] ? currentUserProjects[0].id : 1
}

const makeSelectProjectById = createSelector(
  [selectProjects, selectId],
  findProjectById
)

const makeSelectDeduplicatedProjects = createSelector(
  [selectProjects],
  dedupProjects
)

const makeSelectProjectsByCurrentUserId = createSelector(
  [selectProjects, selectUserProjects, selectCurrentUserId],
  filterProjectsByCurrentUserId
)

const makeSelectFirstProjectIdByCurrentUserId = createSelector(
  [selectProjects, selectUserProjects, selectCurrentUserId],
  findFirstProjectIDByCurrentUserId
)

const projects = {
  makeSelectProjectById,
  makeSelectDeduplicatedProjects,
  makeSelectFirstProjectIdByCurrentUserId,
  makeSelectProjectsByCurrentUserId
}

export default projects
