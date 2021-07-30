import actions from './index'

const createCategory = payload => ({
  type: 'CREATE_CATEGORY',
  payload
})

const updateCategory = payload => ({
  type: 'UPDATE_CATEGORY',
  payload
})

const deleteCategory = payload => ({
  type: 'DELETE_CATEGORY',
  payload
})

const deeplyDeleteCategory = payload => dispatch => {
  console.log('deeply deleting category')
  dispatch(deleteCategory(payload))
  dispatch(actions.deleteTodosByCategory(payload))
}

const deleteCategoriesByProject = payload => (dispatch, getState) => {
  console.log('deleting categories by project')
  const categories = getState().categories.filter(
    category => category.projectID === payload.id
  )
  for (const category of categories) {
    dispatch(deeplyDeleteCategory(category))
  }
}

const categoryActions = {
  createCategory,
  deleteCategory,
  deeplyDeleteCategory,
  deleteCategoriesByProject,
  updateCategory
}

export default categoryActions
