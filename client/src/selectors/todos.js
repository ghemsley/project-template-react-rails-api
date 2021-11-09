import { createSelector } from 'redux-views'
import { selectId, selectCurrentUserId } from './helpers'
import { selectUserProjects } from './userProjects'
import { selectCategories } from './categories'

const selectTodos = state => state.todos

const findTodoById = (todos, todoID) => todos.find(todo => todo.id === todoID)

const filterTodosByCategoryId = (todos, categoryID) => {
  const compareOrder = (todo1, todo2) => todo1.order - todo2.order
  return todos.filter(todo => todo.categoryID === categoryID).sort(compareOrder)
}

const filterTodosByCurrentUserId = (todos, userProjects, categories, currentUserID) => {
  const currentUserUserProjects = userProjects.filter(userProj => userProj.userID === currentUserID)
  const currentUserCategories = []
  for (const userProject of currentUserUserProjects) {
    const foundCategories = categories.filter(cat => cat.projectID === userProject.projectID)
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

export const makeSelectTodoById = createSelector([selectTodos, selectId], findTodoById)

const makeSelectTodosByCurrentUserId = createSelector(
  [selectTodos, selectUserProjects, selectCategories, selectCurrentUserId],
  filterTodosByCurrentUserId
)

export const makeSelectTodosByCategoryId = createSelector(
  [selectTodos, selectId],
  filterTodosByCategoryId
)

const todos = { makeSelectTodoById, makeSelectTodosByCurrentUserId, makeSelectTodosByCategoryId }

export default todos
