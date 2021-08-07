import actions from './index'
import CONSTANTS from '../constants'

const fetchCategory = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories/${payload.id}`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const fetchCategories = () => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const sendCategory = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: actions.getToken()
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const patchCategory = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories/${payload.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: actions.getToken()
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const destroyCategory = payload => () => {
  console.log('destroying category')
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories/${payload.id}`, {
    method: 'delete',
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
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
  console.log('instantiating category')
  return dispatch(sendCategory(payload)).then(json => {
    const categoryObject = {
      id: json.data.id,
      name: json.data.attributes.name,
      description: json.data.attributes.description,
      projectID: json.data.relationships.project.data.id,
      order: json.data.attributes.order
    }
    dispatch(createCategory(categoryObject))
  })
}

const removeCategory = payload => dispatch => {
  console.log('removing category')
  dispatch(destroyCategory(payload)).then(json => {
    if (json.data.id === payload.id) {
      dispatch(deeplyDeleteCategory(payload))
    }
  })
}

const amendCategory = payload => dispatch => {
  console.log('amending category')
  return dispatch(patchCategory(payload)).then(json => {
    if (json.data.id === payload.id) {
      dispatch(updateCategory(payload))
    }
  })
}

const patchCategories = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories/batch_update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}
const updateCategories = payload => ({
  type: 'UPDATE_CATEGORIES',
  payload
})
const batchAmendCategories = payload => dispatch => {
  console.log('batch amend categories')
  return dispatch(patchCategories(payload)).then(json => {
    dispatch(updateCategories(payload))
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
  instantiateCategory,
  destroyCategory,
  removeCategory,
  patchCategory,
  amendCategory,
  updateCategories,
  patchCategories,
  batchAmendCategories
}

export default categoryActions
