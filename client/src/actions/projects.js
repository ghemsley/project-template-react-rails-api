import actions from './index'

const createProject = payload => ({
  type: 'CREATE_PROJECT',
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

const updateProject = payload => ({
  type: 'UPDATE_PROJECT',
  payload
})

const projectActions = {
  createProject,
  deleteProject,
  deeplyDeleteProject,
  updateProject
}

export default projectActions
