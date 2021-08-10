Rails.application.routes.draw do
  namespace :api do
    devise_for :users, path: '', path_names: {
      sign_in: 'login',
      sign_out: 'logout',
      registration: 'signup'
    }, controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations'
    }
    resources :user_projects, only: %i[index show create destroy]
    resources :users, only: %i[index show create update destroy]
    resources :todos, only: %i[index show create update destroy]
    resources :categories, only: %i[index show create update destroy]
    resources :projects, only: %i[index show create update destroy]
  end

  get '/api/current_user', to: 'current_user#index'

  patch '/api/todos/batch_update', to: 'todos#batch_update'
  patch '/api/categories/batch_update', to: 'categories#batch_update'
  patch '/api/projects/batch_update', to: 'projects#batch_update'

  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  get '*path', to: 'fallback#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end
