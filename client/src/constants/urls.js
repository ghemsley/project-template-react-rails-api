const URLS = {
  BASE_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://tada-todo-list.herokuapp.com/api'
      : 'http://localhost:3000/api'
}

export default URLS
