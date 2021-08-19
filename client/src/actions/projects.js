import actions from './index'
import CONSTANTS from '../constants'
import helpers from '../helpers'

const fetchProject = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects/${payload.id}`, {
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

const fetchAllProjects = () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects?include=user_projects`, {
    headers: { Accept: 'application/json' }
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

const sendProject = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects`, {
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

const patchProject = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects/${payload.id}`, {
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

const patchProjects = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects/batch_update`, {
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

const destroyProject = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/projects/${payload.id}`, {
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
          project => project.id === json.project.data.attributes.id
        ) &&
        !state.userProjects.find(
          userProj => userProj.id === json.user_project.data.attributes.id
        )
      ) {
        const project = {
          id: json.project.data.id,
          name: json.project.data.attributes.name,
          description: json.project.data.attributes.description,
          order: json.project.data.attributes.order,
          private: json.project.data.attributes.private
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
          if (!state.projects.find(proj => proj.id === project.attributes.id)) {
            dispatch(
              createProject({
                id: project.attributes.id,
                name: project.attributes.name,
                description: project.attributes.description,
                order: project.attributes.order,
                private: project.attributes.private
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
              userProject =>
                userProject.id === included.id ||
                (userProject.userID === included.user_id &&
                  userProject.projectID === included.project_id)
            )
          ) {
            const userProject = {
              id: included.id,
              userID: included.attributes.user_id,
              projectID: included.attributes.project_id,
              owner: included.attributes.owner
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
      userProj.projectID === payload.id && userProj.userID !== currentUser.id
  )
  if (userProjectsFromOtherUsers.length > 0) {
    return Promise.reject(
      "You can't delete a project that still has other users"
    )
  } else {
    return destroyProject(payload).then(json => {
      if (json.data) {
        dispatch(deeplyDeleteProject(payload))
      }
      return json
    }).then((json) => {
      const coordinates = state.coordinates.find(
        coords => coords.item.id === payload.id && coords.type === 'project'
      )
      if (coordinates) {
        dispatch(actions.deleteCoordinates(coordinates))
      }
      return json
    })
  }
}

const amendProject = payload => dispatch => {
  return patchProject(payload).then(json => {
    if (json.data) {
      dispatch(updateProject(payload))
    }
    return json
  })
}

const batchAmendProjects = payload => dispatch => {
  return patchProjects(payload).then(json => {
    dispatch(updateProjects(payload))
    return json
  })
}

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
  instantiateAllProjects
}

export default projectActions
