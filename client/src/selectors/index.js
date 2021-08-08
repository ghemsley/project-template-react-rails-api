import { createSelector, createIdSelector } from 'redux-views'

const selectCoordinates = state => state.coordinates

const selectAcceptType = createIdSelector(props => props.acceptType)

const selectParentType = createIdSelector(props => props.parentType)

const selectParentID = createIdSelector(props => props.parentID)

const filterCoordinates = (coordinates, acceptType, parentType, parentID) =>
  coordinates
    .filter(
      coords =>
        coords.type === acceptType &&
        coords.item[`${parentType}ID`] === parentID
    )
    .sort((coords1, coords2) => coords1.item.order - coords2.item.order)

export const makeSelectChildCoordinates = () =>
  createSelector(
    [selectCoordinates, selectAcceptType, selectParentType, selectParentID],
    filterCoordinates
  )

const selectProjects = state => state.projects

const selectCategoryProjectID = createIdSelector(
  props => props.category.projectID
)

const findProjectByCategoryProjectID = (projects, projectID) =>
  projects.find(project => project.id === projectID)

export const makeSelectProjectByCategoryProjectID = createSelector(
  [selectProjects, selectCategoryProjectID],
  findProjectByCategoryProjectID
)

const selectTodos = state => state.todos

const selectCategoryID = createIdSelector(props => props.category.id)

const filterTodosByCategoryID = (todos, categoryID) => {
  const compareOrder = (todo1, todo2) => todo1.order - todo2.order
  return todos.filter(todo => todo.categoryID === categoryID).sort(compareOrder)
}

export const makeSelectTodosByCategoryID = createSelector(
  [selectTodos, selectCategoryID],
  filterTodosByCategoryID
)

const selectCategories = state => state.categories

const selectTodoCategoryID = createIdSelector(props => props.todo.categoryID)

const findCategoryByTodoCategoryID = (categories, todoCategoryID) =>
  categories.filter(category => category.id === todoCategoryID)

export const makeSelectCategoryByTodoCategoryID = createSelector(
  [selectCategories, selectTodoCategoryID],
  findCategoryByTodoCategoryID
)

const selectProjectID = createIdSelector(props => props.project.id)

const filterCategoriesByProjectId = (categories, projectID) => {
  const compareOrder = (category1, category2) =>
    category1.order - category2.order
  return categories
    .filter(category => category.projectID === projectID)
    .sort(compareOrder)
}

export const makeSelectCategoriesByProjectID = createSelector(
  [selectCategories, selectProjectID],
  filterCategoriesByProjectId
)

const selectUserProjects = state => state.userProjects

const selectCurrentUserID = state => state.authentication.currentUser.id

const findUserProjectByCurrentUserIDAndProjectID = (
  userProjects,
  currentUserID,
  projectID
) => {
  return userProjects.find(
    userProj =>
      userProj.userID === currentUserID && userProj.projectID === projectID
  )
}
export const makeSelectUserProject = createSelector(
  [selectUserProjects, selectCurrentUserID, selectProjectID],
  findUserProjectByCurrentUserIDAndProjectID
)
