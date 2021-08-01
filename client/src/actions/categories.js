import actions from './index'
import constants from '../constants'

const fetchCategory = payload => () => {
  return fetch(`${constants.urls.BASE_URL}/categories/${payload.id}`, {
    headers: { Accept: 'application/json' }
  }).then(response => response.json())
}

const fetchCategories = () => () => {
  return fetch(`${constants.urls.BASE_URL}/categories`, {
    headers: { Accept: 'application/json' }
  }).then(response => response.json())
}

const sendCategory = payload => () => {
  return fetch(`${constants.urls.BASE_URL}/categories`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  }).then(response => response.json())
}

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

const instantiateCategory = payload => dispatch => {
  return dispatch(sendCategory(payload)).then(json => {
    const categoryObject = {
      id: json.data.id,
      name: json.data.attributes.name,
      description: json.data.attributes.description,
      projectID: json.data.relationships.project.data.id
    }
    dispatch(createCategory(categoryObject))
  })
}

const categoryActions = {
  fetchCategory,
  fetchCategories,
  sendCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  deeplyDeleteCategory,
  deleteCategoriesByProject,
  instantiateCategory
}

export default categoryActions
