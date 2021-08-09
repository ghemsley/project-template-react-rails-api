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
        parseInt(coords.item[`${parentType}ID`]) === parseInt(parentID)
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
  projects.find(project => parseInt(project.id) === parseInt(projectID))

export const makeSelectProjectByCategoryProjectID = createSelector(
  [selectProjects, selectCategoryProjectID],
  findProjectByCategoryProjectID
)

const selectTodos = state => state.todos

const selectCategoryID = createIdSelector(props => props.category.id)

const filterTodosByCategoryID = (todos, categoryID) => {
  const compareOrder = (todo1, todo2) => todo1.order - todo2.order
  return todos
    .filter(todo => parseInt(todo.categoryID) === parseInt(categoryID))
    .sort(compareOrder)
}

export const makeSelectTodosByCategoryID = createSelector(
  [selectTodos, selectCategoryID],
  filterTodosByCategoryID
)

const selectCategories = state => state.categories

const selectTodoCategoryID = createIdSelector(props => props.todo.categoryID)

const findCategoryByTodoCategoryID = (categories, todoCategoryID) =>
  categories.find(
    category => parseInt(category.id) === parseInt(todoCategoryID)
  )

export const makeSelectCategoryByTodoCategoryID = createSelector(
  [selectCategories, selectTodoCategoryID],
  findCategoryByTodoCategoryID
)

const selectTodoEditCategoryID = createIdSelector(categoryID => categoryID)

const findCategoryByTodoEditCategoryID = (categories, categoryID) =>
  categories.find(category => parseInt(category.id) === parseInt(categoryID))

export const makeSelectCategoryByTodoEditCategoryID = createSelector(
  [selectCategories, selectTodoEditCategoryID],
  findCategoryByTodoEditCategoryID
)

const selectProjectID = createIdSelector(props => props.project.id)

const filterCategoriesByProjectId = (categories, projectID) => {
  const compareOrder = (category1, category2) =>
    category1.order - category2.order
  return categories
    .filter(category => parseInt(category.projectID) === parseInt(projectID))
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
      parseInt(userProj.userID) === parseInt(currentUserID) &&
      parseInt(userProj.projectID) === parseInt(projectID)
  )
}
export const makeSelectUserProject = createSelector(
  [selectUserProjects, selectCurrentUserID, selectProjectID],
  findUserProjectByCurrentUserIDAndProjectID
)

const filterProjectsByCurrentUserID = (
  projects,
  userProjects,
  currentUserID
) => {
  const currentUserUserProjects = userProjects.filter(
    userProj => parseInt(userProj.userID) === parseInt(currentUserID)
  )
  const currentUserProjects = []
  for (const userProject of currentUserUserProjects) {
    const foundProject = projects.find(
      proj => parseInt(proj.id) === parseInt(userProject.projectID)
    )
    if (foundProject) {
      currentUserProjects.push(foundProject)
    }
  }
  return currentUserProjects
}

export const makeSelectProjectsByCurrentUserID = createSelector(
  [selectProjects, selectUserProjects, selectCurrentUserID],
  filterProjectsByCurrentUserID
)

const filterCategoriesByCurrentUserID = (
  categories,
  userProjects,
  currentUserID
) => {
  const currentUserUserProjects = userProjects.filter(
    userProj => parseInt(userProj.userID) === parseInt(currentUserID)
  )
  const currentUserCategories = []
  for (const userProject of currentUserUserProjects) {
    const foundCategories = categories.filter(
      cat => parseInt(cat.projectID) === parseInt(userProject.projectID)
    )
    if (foundCategories) {
      currentUserCategories.push(...foundCategories)
    }
  }
  return currentUserCategories
}

export const makeSelectCategoriesByCurrentUserID = createSelector(
  [selectCategories, selectUserProjects, selectCurrentUserID],
  filterCategoriesByCurrentUserID
)

const filterTodosByCurrentUserID = (
  todos,
  userProjects,
  categories,
  currentUserID
) => {
  const currentUserUserProjects = userProjects.filter(
    userProj => parseInt(userProj.userID) === parseInt(currentUserID)
  )
  const currentUserCategories = []
  for (const userProject of currentUserUserProjects) {
    const foundCategories = categories.filter(
      cat => parseInt(cat.projectID) === parseInt(userProject.projectID)
    )
    if (foundCategories) {
      currentUserCategories.push(...foundCategories)
    }
  }
  const currentUserTodos = []
  for (const category of currentUserCategories) {
    const foundTodos = todos.filter(
      todo => parseInt(todo.categoryID) === parseInt(category.id)
    )
    if (todos) {
      currentUserTodos.push(...foundTodos)
    }
  }
  return currentUserTodos
}

export const makeSelectTodosByCurrentUserID = createSelector(
  [selectTodos, selectUserProjects, selectCategories, selectCurrentUserID],
  filterTodosByCurrentUserID
)
