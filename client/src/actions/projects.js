import actions from './index'
import constants from '../constants'

const fetchProject = payload => () => {
  return fetch(`${constants.urls.BASE_URL}/projects/${payload.id}`, {
    headers: { Accept: 'application/json' }
  }).then(response => response.json())
}

const fetchProjects = () => () => {
  return fetch(`${constants.urls.BASE_URL}/projects`, {
    headers: { Accept: 'application/json' }
  }).then(response => response.json())
}

const fetchEverything = () => () => {
  return fetch(`${constants.urls.BASE_URL}/projects?include=categories,todos`, {
    headers: { Accept: 'application/json' }
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

const deleteProject = payload => ({
  type: 'DELETE_PROJECT',
  payload
})

const deeplyDeleteProject = payload => dispatch => {
  console.log('deeply deleting project')
  dispatch(deleteProject(payload))
  dispatch(actions.deleteCategoriesByProject(payload))
}

const instantiateEverything = () => dispatch => {
  return dispatch(fetchEverything())
    .then(json => {
      for (const project of json.data) {
        const projectObject = {
          id: project.id,
          name: project.attributes.name,
          description: project.attributes.description
        }
        dispatch(createProject(projectObject))
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
          dispatch(actions.createCategory(categoryObject))
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
          dispatch(actions.createTodo(todoObject))
        }
      }
      return json
    })
}

const projectActions = {
  fetchProject,
  fetchProjects,
  fetchEverything,
  createProject,
  updateProject,
  deleteProject,
  deeplyDeleteProject,
  instantiateEverything
}

export default projectActions
