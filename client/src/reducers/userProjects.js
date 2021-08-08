const userProjects = (state = [], action) => {
  switch (action.type) {
    case 'CREATE_USER_PROJECT':
      console.log('creating userproject')
      return [...state, action.payload]

    case 'DELETE_USER_PROJECT':
      console.log('deleting userproject')
      return [...state.filter(userProject => userProject.id !== action.payload.id)]

    default:
      return state
  }
}

export default userProjects
