import actions from './index'
import CONSTANTS from '../constants'

const fetchProject = payload => () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects/${payload.id}`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const fetchAllProjects = () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects?include=user_projects`, {
    headers: { Accept: 'application/json' }
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
  dispatch(deleteProject(payload))
  dispatch(actions.deleteCategoriesByProject(payload))
}

const instantiateProject = payload => (dispatch, getState) => {
  const state = getState()
  return sendProject(payload).then(json => {
    if (json.project) {
      if (
        !state.projects.find(
          project =>
            parseInt(project.id) === parseInt(json.project.data.attributes.id)
        ) &&
        !state.userProjects.find(
          userProj =>
            parseInt(userProj.id) ===
            parseInt(json.user_project.data.attributes.id)
        )
      ) {
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
      }
    }
    return json
  })
}

const instantiateAllProjects = () => (dispatch, getState) => {
  const state = getState()
  return fetchAllProjects()
    .then(json => {
      if (json.data) {
        for (const project of json.data) {
          if (
            !state.projects.find(
              proj => parseInt(proj.id) === parseInt(project.attributes.id)
            )
          ) {
            dispatch(
              createProject({
                id: project.attributes.id,
                name: project.attributes.name,
                description: project.attributes.description,
                order: project.attributes.order
              })
            )
          }
        }
      }
      return json
    })
    .then(json => {
      if (json.included) {
        for (const included of json.included) {
          if (
            included.type === 'user_project' &&
            !state.userProjects.find(
              userProject => parseInt(userProject.id) === parseInt(included.id)
            )
          ) {
            const userProject = {
              id: included.id,
              userID: included.attributes.user_id,
              projectID: included.attributes.project_id
            }
            dispatch(actions.createUserProject(userProject))
          }
        }
      }
      return json
    })
}

const removeProject = payload => (dispatch, getState) => {
  const state = getState()
  const currentUser = state.authentication.currentUser
  const userProjectsFromOtherUsers = state.userProjects.filter(
    userProj =>
      parseInt(userProj.projectID) === parseInt(payload.id) &&
      parseInt(userProj.userID) !== parseInt(currentUser.id)
  )
  if (userProjectsFromOtherUsers.length > 0) {
    return Promise.reject(
      "You can't delete a project that still has other users"
    )
  } else {
    return dispatch(destroyProject(payload)).then(json => {
      if (parseInt(json.data.id) === parseInt(payload.id)) {
        dispatch(deeplyDeleteProject(payload))
      }
      return json
    })
  }
}

const amendProject = payload => dispatch => {
  return dispatch(patchProject(payload)).then(json => {
    if (parseInt(json.data.id) === parseInt(payload.id)) {
      dispatch(updateProject(payload))
    }
    return json
  })
}

const batchAmendProjects = payload => dispatch => {
  return dispatch(patchProjects(payload)).then(json => {
    dispatch(updateProjects(payload))
    return json
  })
}

const resetProjects = () => ({
  type: 'RESET_PROJECTS'
})

const projectActions = {
  fetchProject,
  fetchAllProjects,
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
  batchAmendProjects,
  instantiateAllProjects,
  resetProjects
}

export default projectActions
