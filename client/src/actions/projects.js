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

const sendProject = payload => {
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
  return sendProject(payload).then(json => {
    console.log('new project', json)
    const project = {
      id: json.project.data.id,
      name: json.project.data.attributes.name,
      description: json.project.data.attributes.description,
      order: json.project.data.attributes.order
    }
    const userProject = {
      id: json.user_project.data.attributes.id,
      userID: json.user_project.data.attributes.user_id,
      projectID: json.user_project.data.attributes.project_id
    }
    dispatch(createProject(project))
    dispatch(actions.createUserProject(userProject))
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
  sendProject,
  createProject,
  updateProject,
  updateProjects,
  deleteProject,
  deeplyDeleteProject,
  instantiateProject,
  destroyProject,
  removeProject,
  patchProject,
  patchProjects,
  amendProject,
  batchAmendProjects
}

export default projectActions
