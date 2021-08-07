Rails.application.routes.draw do
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  }, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  get '/current_user', to: 'current_user#index'

  patch '/todos/batch_update', to: 'todos#batch_update'
  patch '/categories/batch_update', to: 'categories#batch_update'
  patch '/projects/batch_update', to: 'projects#batch_update'

  resources :user_projects, only: %i[index show]
  resources :users, only: %i[index show create update destroy]
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

  get '/projects/:id/users', to: 'project_users#index'
  get '/projects/:project_id/users/:user_id', to: 'project_users#show'

  get '/users/:id/projects', to: 'user_projects#index_user_projects'
  get '/users/:user_id/projects/:project_id', to: 'user_projects#show_user_project'

  get '/users/:id/categories', to: 'user_categories#index'
  get '/users/:user_id/categories/:category_id', to: 'user_categories#show'

  get '/users/:id/todos', to: 'user_todos#index'
  get '/users/:user_id/categories/:todo_id', to: 'user_todos#show'

  get '/user_projects/:id/user', to: 'user_projects#show_user'
  get '/user_projects/:id/project', to: 'user_projects#show_project'

  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  get '*path', to: 'fallback#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end
