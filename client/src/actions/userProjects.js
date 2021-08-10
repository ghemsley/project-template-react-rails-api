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

const sendUserProject = payload => (dispatch, getState) => {
  const userProjects = getState().userProjects
  if (
    !userProjects.find(
      userProj =>
        userProj.projectID === payload.project_id &&
        userProj.userID === payload.user_id
    )
  ) {
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
  } else
    return Promise.reject(
      'Userproject already exists for the provided user and project'
    )
}

const destroyUserProject = payload => {
  return fetch(`${CONSTANTS.URLS.BASE_URL}/user_projects/${payload.id}`, {
    method: 'delete',
    headers: { Accept: 'application/json', Authorization: actions.getToken() }
  })
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

const addUserProject = payload => (dispatch, getState) => {
  return dispatch(sendUserProject(payload)).then(json => {
    if (json.data) {
      if (parseInt(json.data.attributes.id) === parseInt(payload.id)) {
        const userProject = {
          id: json.data.attributes.id,
          user_id: json.data.attributes.user_id,
          project_id: json.data.attributes.project_id,
          owner: json.data.attributes.owner
        }
        dispatch(createUserProject(userProject))
      }
    }
    return json
  })
}

const instantiateEverythingForUser = () => (dispatch, getState) => {
  const state = getState()
  const user = state.authentication.currentUser
  return fetchEverythingForUser(user)
    .then(json => {
      if (json.included) {
        for (const included of json.included) {
          if (
            included.type === 'project' &&
            !state.projects.find(
              project => parseInt(project.id) === parseInt(included.id)
            )
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
            !state.categories.find(
              category => parseInt(category.id) === parseInt(included.id)
            )
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
            !state.todos.find(
              todo => parseInt(todo.id) === parseInt(included.id)
            )
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
              userProject =>
                parseInt(userProject.id) === parseInt(included.id) &&
                !(
                  parseInt(userProject.projectID) ===
                    parseInt(included.attributes.project_id) &&
                  parseInt(userProject.userID) ===
                    parseInt(included.attributes.user_id)
                )
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

const removeUserProject = payload => (dispatch, getState) => {
  const otherUsersForProject = getState().userProjects.filter(
    userProj =>
      parseInt(userProj.projectID) === parseInt(payload.projectID) &&
      parseInt(userProj.id) !== parseInt(payload.id)
  )
  if (otherUsersForProject < 1) {
    return Promise.reject(
      "You can't leave your own project if you're its only user"
    )
  } else if (payload.owner === true) {
    return Promise.reject(
      "You can't leave your own project if you're its owner"
    )
  } else {
    return destroyUserProject(payload).then(json => {
      if (parseInt(json.data.attributes.id) === parseInt(payload.id)) {
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
  addUserProject,
  fetchEverythingForUser,
  instantiateEverythingForUser,
  removeUserProject
}

export default userProjectActions
