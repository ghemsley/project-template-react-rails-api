import actions from './index'
import constants from '../constants'

const fetchProject = payload => () => {
  return fetch(`${constants.urls.BASE_URL}/projects/${payload.id}`, {
    headers: { Accept: 'application/json' }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const fetchProjects = () => () => {
  return fetch(`${constants.urls.BASE_URL}/projects`, {
    headers: { Accept: 'application/json' }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const fetchEverything = () => () => {
  return fetch(`${constants.urls.BASE_URL}/projects?include=categories,todos`, {
    headers: { Accept: 'application/json' }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const sendProject = payload => () => {
  return fetch(`${constants.urls.BASE_URL}/projects`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const createProject = payload => ({
  type: 'CREATE_PROJECT',
  payload
})

const updateProject = payload => ({
  type: 'UPDATE_PROJECT',
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
  return dispatch(sendProject(payload)).then(json => {
    const projectObject = {
      id: json.data.id,
      name: json.data.attributes.name,
      description: json.data.attributes.description
    }
    dispatch(createProject(projectObject))
  })
}

const instantiateEverything = () => (dispatch, getState) => {
  const state = getState()
  return dispatch(fetchEverything())
    .then(json => {
      for (const project of json.data) {
        const projectObject = {
          id: project.id,
          name: project.attributes.name,
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
            projectID: included.relationships.project.data.id
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
            categoryID: included.relationships.category.data.id
          }
          if (!state.todos.find(todo => todo.id === todoObject.id)) {
            dispatch(actions.createTodo(todoObject))
          }
        }
      }
      return json
    })
}

const destroyProject = payload => () => {
  console.log('destroying project')
  return fetch(`${constants.urls.BASE_URL}/projects/${payload.id}`, {
    method: 'delete',
    headers: { Accept: 'application/json' }
  }).then(response => response.json())
}

const removeProject = payload => dispatch => {
  console.log('removing project')
  dispatch(destroyProject(payload)).then(json => {
    if (json.data.id === payload.id) {
      dispatch(deeplyDeleteProject(payload))
    }
  })
}

const projectActions = {
  fetchProject,
  fetchProjects,
  fetchEverything,
  sendProject,
  createProject,
  updateProject,
  deleteProject,
  deeplyDeleteProject,
  instantiateProject,
  instantiateEverything,
  destroyProject,
  removeProject
}

export default projectActions
