import actions from './index'
import CONSTANTS from '../constants'
import helpers from '../helpers'

const fetchCategory = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories/${payload.id}`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  }).then(response => {
    if (response.ok) {
      return helpers.convertIdToInt(response.json())
    } else {
      return helpers.convertIdToInt(response.json()).then(error => {
        return Promise.reject(error)
      })
    }
  })
}

const fetchCategories = () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  }).then(response => {
    if (response.ok) {
      return helpers.convertIdToInt(response.json())
    } else {
      return helpers.convertIdToInt(response.json()).then(error => {
        return Promise.reject(error)
      })
    }
  })
}

const sendCategory = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: actions.getToken()
    },
    body: JSON.stringify(payload)
  }).then(response => {
    if (response.ok) {
      return helpers.convertIdToInt(response.json())
    } else {
      return helpers.convertIdToInt(response.json()).then(error => {
        return Promise.reject(error)
      })
    }
  })
}

const patchCategory = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories/${payload.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: actions.getToken()
    },
    body: JSON.stringify(payload)
  }).then(response => {
    if (response.ok) {
      return helpers.convertIdToInt(response.json())
    } else {
      return helpers.convertIdToInt(response.json()).then(error => {
        return Promise.reject(error)
      })
    }
  })
}

const patchCategories = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories/batch_update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: actions.getToken()
    },
    body: JSON.stringify(payload)
  }).then(response => {
    if (response.ok) {
      return helpers.convertIdToInt(response.json())
    } else {
      return helpers.convertIdToInt(response.json()).then(error => {
        return Promise.reject(error)
      })
    }
  })
}

const destroyCategory = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/categories/${payload.id}`, {
    method: 'delete',
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  }).then(response => {
    if (response.ok) {
      return helpers.convertIdToInt(response.json())
    } else {
      return helpers.convertIdToInt(response.json()).then(error => {
        return Promise.reject(error)
      })
    }
  })
}

const createCategory = payload => ({
  type: 'CREATE_CATEGORY',
  payload
})

const updateCategory = payload => ({
  type: 'UPDATE_CATEGORY',
  payload
})

const updateCategories = payload => ({
  type: 'UPDATE_CATEGORIES',
  payload
})

const deleteCategory = payload => ({
  type: 'DELETE_CATEGORY',
  payload
})

const deeplyDeleteCategory = payload => dispatch => {
  dispatch(actions.deleteTodosByCategory(payload))
  dispatch(deleteCategory(payload))
}

const deleteCategoriesByProject = payload => (dispatch, getState) => {
  const categories = getState().categories.filter(
    category => category.projectID === payload.id
  )
  for (const category of categories) {
    dispatch(deeplyDeleteCategory(category))
  }
}

const instantiateCategory = payload => (dispatch, getState) => {
  const state = getState()
  return sendCategory(payload).then(json => {
    if (json.data) {
      if (!state.categories.find(cat => cat.id === json.data.id)) {
        const categoryObject = {
          id: json.data.id,
          name: json.data.attributes.name,
          description: json.data.attributes.description,
          projectID: json.data.relationships.project.data.id,
          order: json.data.attributes.order
        }
        dispatch(createCategory(categoryObject))
      }
    }
    return json
  })
}

const removeCategory = payload => (dispatch, getState) => {
  return destroyCategory(payload).then(json => {
    if (json.data) {
      dispatch(deeplyDeleteCategory(payload))
    }
    return json
  }).then((json) => {
     const coordinates = getState().coordinates.find(
       coords => coords.item.id === payload.id && coords.type === 'category'
     )
     if (coordinates) {
       dispatch(actions.deleteCoordinates(coordinates))
     }
    return json
  })
}

const amendCategory = payload => dispatch => {
  return patchCategory(payload).then(json => {
    if (json.data) {
      dispatch(updateCategory(payload))
    }
    return json
  })
}

const batchAmendCategories = payload => (dispatch, getState) => {
  let newPayload = [...payload]
  const state = getState()
  for (const category of newPayload) {
    if (!state.categories.find(cat => cat.id === category.id)) {
      newPayload = newPayload.filter(cat => cat.id !== category.id)
    }
  }
  return patchCategories(newPayload).then(json => {
    dispatch(updateCategories(newPayload))
    return json
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
