const convertIdToInt = object => {
  for (const key in object) {
    if (
      ['id', 'categoryID', 'projectID', 'userID', 'order'].includes(key) &&
      typeof object[key] === 'string'
    ) {
      try {
        object[key] = parseInt(object[key])
      } catch (e) {
        continue
      }
    }
  }
  return object
}

const helpers = { convertIdToInt }

export default helpers
