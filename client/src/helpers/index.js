const convertIdToInt = object => {
  for (const key in object) {
    if (
      new Set([
        'id',
        'categoryID',
        'category_id',
        'projectID',
        'project_id',
        'userID',
        'user_id',
        'order'
      ]).has(key) &&
      typeof object[key] === 'string'
    ) {
      try {
        object[key] = parseInt(object[key])
      } catch (e) {
        console.log(e)
      }
    } else if (typeof object[key] === 'object') {
      try {
        convertIdToInt(object[key])
      } catch (e) {
        console.log(e)
      }
    }
  }
  return object
}

const helpers = { convertIdToInt }

export default helpers
