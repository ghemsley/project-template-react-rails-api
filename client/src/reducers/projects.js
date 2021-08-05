const projects = (state = [], action) => {
  const compareOrder = (project1, project2) => project1.order - project2.order
  let newState = []
  switch (action.type) {
    case 'CREATE_PROJECT':
      console.log('creating project')
      return [...state, action.payload]

    case 'UPDATE_PROJECT':
      console.log('updating project')
      newState = [...state]
      const currentProject = newState.find(
        project => project.id === action.payload.id
      )
      if (currentProject) {
        for (const key in action.payload) {
          if (key !== 'id') {
            currentProject[key] = action.payload[key]
          }
        }
      }
      return newState

    case 'UPDATE_PROJECTS':
      console.log('batch updating projects')
      newState = [...state]
      for (const project of action.payload) {
        const currentProject = newState.find(existing => existing.id === project.id)
        if (currentProject) {
          for (const key in project) {
            if (key !== 'id') {
              currentProject[key] = project[key]
            }
          }
        }
      }
      newState.sort(compareOrder)
      return newState

    case 'DELETE_PROJECT':
      console.log('deleting project')
      return [...state.filter(project => project.id !== action.payload.id)]

    default:
      return state
  }
}

export default projects
