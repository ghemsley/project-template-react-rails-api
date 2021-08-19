import { createSelector } from 'redux-views'
import { selectId, selectCurrentUserId } from './helpers'
import { selectUserProjects } from './userProjects'

export const selectCategories = state => state.categories

const findCategoryById = (categories, categoryID) =>
  categories.find(category => category.id === categoryID)

const filterCategoriesByProjectId = (categories, projectID) => {
  const compareOrder = (category1, category2) =>
    category1.order - category2.order
  return categories
    .filter(category => category.projectID === projectID)
    .sort(compareOrder)
}
const filterCategoriesByCurrentUserId = (
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

const makeSelectCategoryById = createSelector(
  [selectCategories, selectId],
  findCategoryById
)

const makeSelectCategoriesByProjectId = createSelector(
  [selectCategories, selectId],
  filterCategoriesByProjectId
)

const makeSelectCategoriesByCurrentUserId = createSelector(
  [selectCategories, selectUserProjects, selectCurrentUserId],
  filterCategoriesByCurrentUserId
)

const makeSelectFirstCategoryIdByCurrentUserId = createSelector(
  [selectCategories, selectUserProjects, selectCurrentUserId],
  findFirstCategoryIdByCurrentUserId
)

const categories = {
  makeSelectCategoriesByCurrentUserId,
  makeSelectCategoriesByProjectId,
  makeSelectCategoryById,
  makeSelectFirstCategoryIdByCurrentUserId
}

export default categories
