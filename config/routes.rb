Rails.application.routes.draw do
  resources :todos, only: %i[index show create update destroy]
  resources :categories, only: %i[index show create update destroy]
  resources :projects, only: %i[index show create update destroy]

  get '/todos/:id/category', to: 'todo_category#show'

  get '/categories/:id/todos', to: 'category_todos#index'
  get '/categories/:category_id/todos/:todo_id', to: 'category_todos#show'
  get '/categories/:id/project', to: 'category_project#show'

  get '/projects/:id/categories', to: 'project_categories#index'
  get '/projects/:project_id/categories/:category_id', to: 'project_categories#show'
  get '/projects/:id/todos', to: 'project_todos#index'
  get '/projects/:project_id/todos/:todo_id', to: 'project_todos#show'

  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  get '*path', to: 'fallback#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end
