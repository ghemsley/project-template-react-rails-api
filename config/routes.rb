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

  resources :user_projects, only: %i[index show create destroy]
  resources :users, only: %i[index show create update destroy]
  resources :todos, only: %i[index show create update destroy]
  resources :categories, only: %i[index show create update destroy]
  resources :projects, only: %i[index show create update destroy]

  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  get '*path', to: 'fallback#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end
