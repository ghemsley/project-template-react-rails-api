import actions from '.'
import CONSTANTS from '../constants'

const fetchUserProject = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/user_projects/${payload.id}`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const fetchUserProjects = () => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/user_projects`, {
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
    .then(response => response.json())
    .catch(error => console.log(error))
}

const fetchEverythingForUser = user => {
  return fetch(
    `${CONSTANTS.URLS.BASE_URL}/users/${user.id}?include=user_projects,projects,categories,todos`,
    {
      headers: { Accept: 'application/json', Authorization: actions.getToken() }
    }
  )
    .then(response => response.json())
    .catch(error => console.log(error))
}

const sendUserProject = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/user_projects`, {
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

const destroyUserProject = payload => {
  return fetch(
    `${CONSTANTS.URLS.BASE_URL}/user_projects/${payload.id}?include=project`,
    {
      method: 'delete',
      headers: { Accept: 'application/json', Authorization: actions.getToken() }
    }
  )
    .then(response => response.json())
    .catch(error => console.log(error))
}

const createUserProject = payload => ({
  type: 'CREATE_USER_PROJECT',
  payload
})

const deleteUserProject = payload => ({
  type: 'DELETE_USER_PROJECT',
  payload
})

const instantiateUserProject = payload => dispatch => {
  return sendUserProject(payload).then(json => {
    if (json.user_project.data.attributes.id === payload.id) {
      const userProject = {
        id: json.user_project.data.attributes.id,
        user_id: json.user_project.data.attributes.user_id,
        project_id: json.user_project.data.attributes.project_id
      }
      dispatch(createUserProject(userProject))
    }
  })
}

const instantiateEverythingForUser = () => (dispatch, getState) => {
  console.log('instantiating everything')
  const state = getState()
  const user = state.authentication.currentUser
  return fetchEverythingForUser(user)
    .then(json => {
      if (json.included) {
        for (const included of json.included) {
          if (
            included.type === 'project' &&
            !state.projects.find(project => project.id === included.id)
          ) {
            const projectObject = {
              id: included.id,
              name: included.attributes.name,
              order: included.attributes.order,
              description: included.attributes.description
            }
            dispatch(actions.createProject(projectObject))
          }
        }
      }
      return json
    })
    .then(json => {
      if (json.included) {
        for (const included of json.included) {
          if (
            included.type === 'category' &&
            !state.categories.find(category => category.id === included.id)
          ) {
            const categoryObject = {
              id: included.id,
              name: included.attributes.name,
              description: included.attributes.description,
              projectID: included.relationships.project.data.id,
              order: included.attributes.order
            }
            dispatch(actions.createCategory(categoryObject))
          }
        }
      }
      return json
    })
    .then(json => {
      if (json.included) {
        for (const included of json.included) {
          if (
            included.type === 'todo' &&
            !state.todos.find(todo => todo.id === included.id)
          ) {
            const todoObject = {
              id: included.id,
              name: included.attributes.name,
              description: included.attributes.description,
              categoryID: included.relationships.category.data.id,
              order: included.attributes.order
            }
            dispatch(actions.createTodo(todoObject))
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
              userProject => userProject.id === included.id
            )
          ) {
            const existingUserProject = {
              id: included.id,
              userID: included.attributes.user_id,
              projectID: included.attributes.project_id
            }
            dispatch(actions.createUserProject(existingUserProject))
          }
        }
      }
      return json
    })
}

const removeUserProject = payload => (dispatch, getState) => {
  const otherUsersForProject = getState().userProjects.filter(
    userProj =>
      userProj.projectID === payload.projectID && userProj.id !== payload.id
  )
  if (otherUsersForProject < 1) {
    return Promise.reject(
      "You can't leave your own project if you're its only user"
    )
  } else {
    return destroyUserProject(payload).then(json => {
      if (json.data.attributes.id === payload.id) {
        dispatch(deleteUserProject(payload))
      }
      return json
    })
  }
}

const userProjectActions = {
  fetchUserProject,
  fetchUserProjects,
  destroyUserProject,
  createUserProject,
  deleteUserProject,
  sendUserProject,
  instantiateUserProject,
  fetchEverythingForUser,
  instantiateEverythingForUser,
  removeUserProject
}

export default userProjectActions
