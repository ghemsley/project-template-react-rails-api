import actions from './index'
import CONSTANTS from '../constants'

const fetchProject = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects/${payload.id}`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const fetchProjects = () => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const fetchEverything = () => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects?include=categories,todos`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const sendProject = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects`, {
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

const patchProject = payload => () => {
  console.log(payload)
  console.log(JSON.stringify(payload))
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects/${payload.id}`, {
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

const patchProjects = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects/batch_update`, {
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

const destroyProject = payload => () => {
  console.log('destroying project')
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects/${payload.id}`, {
    method: 'delete',
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  }).then(response => response.json())
}

const createProject = payload => ({
  type: 'CREATE_PROJECT',
  payload
})

const updateProject = payload => ({
  type: 'UPDATE_PROJECT',
  payload
})

const updateProjects = payload => ({
  type: 'UPDATE_PROJECTS',
  payload
})

const deleteProject = payload => ({
  type: 'DELETE_PROJECT',
  payload
})

const deeplyDeleteProject = payload => dispatch => {
  console.log('deeply deleting project')
  dispatch(deleteProject(payload))
  dispatch(actions.deleteCategoriesByProject(payload))
}

const instantiateProject = payload => dispatch => {
  console.log('instantiating project')
  return dispatch(sendProject(payload)).then(json => {
    const projectObject = {
      id: json.data.id,
      name: json.data.attributes.name,
      description: json.data.attributes.description,
      order: json.data.attributes.order
    }
    dispatch(createProject(projectObject))
  })
}

const instantiateEverything = () => (dispatch, getState) => {
  console.log('instantiating everything')
  const state = getState()
  return dispatch(fetchEverything())
    .then(json => {
      console.log(json)
      for (const project of json.data) {
        const projectObject = {
          id: project.id,
          name: project.attributes.name,
          order: project.attributes.order,
          description: project.attributes.description
        }
        if (!state.projects.find(project => project.id === projectObject.id)) {
          dispatch(actions.createProject(projectObject))
        }
      }

      return json
    })
    .then(json => {
      for (const included of json.included) {
        if (included.type === 'category') {
          const categoryObject = {
            id: included.id,
            name: included.attributes.name,
            description: included.attributes.description,
            projectID: included.relationships.project.data.id,
            order: included.attributes.order
          }
          if (
            !state.categories.find(
              category => category.id === categoryObject.id
            )
          ) {
            dispatch(actions.createCategory(categoryObject))
          }
        }
      }
      return json
    })
    .then(json => {
      for (const included of json.included) {
        if (included.type === 'todo') {
          const todoObject = {
            id: included.id,
            name: included.attributes.name,
            description: included.attributes.description,
            categoryID: included.relationships.category.data.id,
            order: included.attributes.order
          }
          if (!state.todos.find(todo => todo.id === todoObject.id)) {
            dispatch(actions.createTodo(todoObject))
          }
        }
      }
      return json
    })
}

const removeProject = payload => dispatch => {
  console.log('removing project')
  dispatch(destroyProject(payload)).then(json => {
    if (json.data.id === payload.id) {
      dispatch(deeplyDeleteProject(payload))
    }
  })
}

const amendProject = payload => dispatch => {
  console.log('amending project')
  return dispatch(patchProject(payload)).then(json => {
    if (json.data.id === payload.id) {
      dispatch(updateProject(payload))
    }
  })
}

const batchAmendProjects = payload => dispatch => {
  console.log('batch amend projects')
  return dispatch(patchProjects(payload)).then(json => {
    dispatch(updateProjects(payload))
  })
}

const projectActions = {
  fetchProject,
  fetchProjects,
  fetchEverything,
  sendProject,
  createProject,
  updateProject,
  updateProjects,
  deleteProject,
  deeplyDeleteProject,
  instantiateProject,
  instantiateEverything,
  destroyProject,
  removeProject,
  patchProject,
  patchProjects,
  amendProject,
  batchAmendProjects
}

export default projectActions
