const URLS = {
  BASE_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://tada-todo-list.herokuapp.com'
      : 'http://localhost:3000'
}

export default URLS
