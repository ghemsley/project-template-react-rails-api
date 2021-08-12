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

const selectProjects = state => state.projects

const findProjectByCategoryProjectID = (projects, projectID) =>
  projects.find(project => project.id === projectID)

const selectTodos = state => state.todos

const selectCategoryId = createIdSelector(categoryID => categoryID)

const filterTodosByCategoryID = (todos, categoryID) => {
  const compareOrder = (todo1, todo2) => todo1.order - todo2.order
  return todos.filter(todo => todo.categoryID === categoryID).sort(compareOrder)
}

const selectCategories = state => state.categories

const selectTodoCategoryID = createIdSelector(categoryID => categoryID)

const findCategoryByTodoCategoryID = (categories, todoCategoryID) =>
  categories.find(category => category.id === todoCategoryID)

const selectTodoEditCategoryID = createIdSelector(categoryID => categoryID)

const findCategoryByTodoEditCategoryID = (categories, categoryID) =>
  categories.find(category => category.id === categoryID)

const selectProjectID = createIdSelector(projectID => projectID)

const filterCategoriesByProjectId = (categories, projectID) => {
  const compareOrder = (category1, category2) =>
    category1.order - category2.order
  return categories
    .filter(category => category.projectID === projectID)
    .sort(compareOrder)
}

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

const filterProjectsByCurrentUserID = (
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

const filterCategoriesByCurrentUserID = (
  categories,
  userProjects,
  currentUserID
) => {
  const currentUserUserProjects = userProjects.filter(
    userProj => userProj.userID === currentUserID
  )
  const currentUserCategories = []
  for (const userProject of currentUserUserProjects) {
    const foundCategories = categories.filter(
      cat => cat.projectID === userProject.projectID
    )
    if (foundCategories) {
      for (const foundCategory of foundCategories) {
        if (!currentUserCategories.find(cat => cat.id === foundCategory.id)) {
          currentUserCategories.push(foundCategory)
        }
      }
    }
  }
  return currentUserCategories
}

const filterTodosByCurrentUserID = (
  todos,
  userProjects,
  categories,
  currentUserID
) => {
  const currentUserUserProjects = userProjects.filter(
    userProj => userProj.userID === currentUserID
  )
  const currentUserCategories = []
  for (const userProject of currentUserUserProjects) {
    const foundCategories = categories.filter(
      cat => cat.projectID === userProject.projectID
    )
    if (foundCategories) {
      for (const foundCategory of foundCategories) {
        if (!currentUserCategories.find(cat => cat.id === foundCategory.id)) {
          currentUserCategories.push(foundCategory)
        }
      }
    }
  }
  const currentUserTodos = []
  for (const category of currentUserCategories) {
    const foundTodos = todos.filter(todo => todo.categoryID === category.id)
    if (foundTodos) {
      for (const foundTodo of foundTodos) {
        if (!currentUserTodos.find(todo => todo.id === foundTodo.id)) {
          currentUserTodos.push(foundTodo)
        }
      }
    }
  }
  return currentUserTodos
}

const dedupProjects = projects => {
  const deduplicatedProjects = []
  for (const project of projects) {
    if (!deduplicatedProjects.find(proj => proj.id === project.id)) {
      deduplicatedProjects.push(project)
    }
  }
  return projects
}

const findProjectByProjectId = (projects, projectID) =>
  projects.find(project => project.id === projectID)

const findFirstProjectIDByCurrentUserID = (
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

const findFirstCategoryIdByCurrentUserId = (
  categories,
  userProjects,
  currentUserID
) => {
  const currentUserUserProjects = userProjects.filter(
    userProj => userProj.userID === currentUserID
  )
  const currentUserCategories = categories.filter(cat =>
    currentUserUserProjects
      .map(userProj => userProj.projectID)
      .includes(cat.projectID)
  )
  return currentUserCategories[0].id
}

const findCategoryByCategoryId = (categories, categoryID) =>
  categories.find(cat => cat.id === categoryID)

  const findTodoByTodoId = (todos, todoID) =>
    todos.find(todo => todo.id === todoID)

  const selectTodoId = createIdSelector(todoID => todoID)


export const makeSelectProjectByProjectID = createSelector(
  [selectProjects, selectProjectID],
  findProjectByProjectId
)

export const makeSelectProjectByCategoryProjectID = createSelector(
  [selectProjects, selectProjectID],
  findProjectByCategoryProjectID
)

export const makeSelectDeduplicatedProjects = createSelector(
  [selectProjects],
  dedupProjects
)

export const makeSelectTodosByCurrentUserID = createSelector(
  [selectTodos, selectUserProjects, selectCategories, selectCurrentUserID],
  filterTodosByCurrentUserID
)

export const makeSelectCategoriesByCurrentUserID = createSelector(
  [selectCategories, selectUserProjects, selectCurrentUserID],
  filterCategoriesByCurrentUserID
)

export const makeSelectProjectsByCurrentUserID = createSelector(
  [selectProjects, selectUserProjects, selectCurrentUserID],
  filterProjectsByCurrentUserID
)

export const makeSelectUserProjectByCurrentUserAndProjectId = createSelector(
  [selectUserProjects, selectCurrentUserID, selectProjectID],
  findUserProjectByCurrentUserIDAndProjectID
)

export const makeSelectCategoriesByProjectID = createSelector(
  [selectCategories, selectProjectID],
  filterCategoriesByProjectId
)

export const makeSelectChildCoordinates = () =>
  createSelector(
    [selectCoordinates, selectAcceptType, selectParentType, selectParentID],
    filterCoordinates
  )

export const makeSelectTodosByCategoryID = createSelector(
  [selectTodos, selectCategoryId],
  filterTodosByCategoryID
)
export const makeSelectCategoryByTodoCategoryID = createSelector(
  [selectCategories, selectTodoCategoryID],
  findCategoryByTodoCategoryID
)
export const makeSelectCategoryByTodoEditCategoryID = createSelector(
  [selectCategories, selectTodoEditCategoryID],
  findCategoryByTodoEditCategoryID
)

export const makeSelectFirstProjectIdByCurrentUser = createSelector(
  [selectProjects, selectUserProjects, selectCurrentUserID],
  findFirstProjectIDByCurrentUserID
)

export const makeSelectFirstCategoryIDByCurrentUser = createSelector(
  [selectCategories, selectUserProjects, selectCurrentUserID],
  findFirstCategoryIdByCurrentUserId
)

export const makeSelectCategoryByCategoryID = createSelector(
  [selectCategories, selectCategoryId],
  findCategoryByCategoryId
)

export const makeSelectTodoByTodoID = createSelector([selectTodos, selectTodoId], findTodoByTodoId )
