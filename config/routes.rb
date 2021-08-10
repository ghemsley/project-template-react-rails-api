Rails.application.routes.draw do
  devise_for :users, path: '', path_names: {
    sign_in: 'api/login',
    sign_out: 'api/logout',
    registration: 'api/signup'
  }, controllers: {
    sessions: 'api/users/sessions',
    registrations: 'api/users/registrations'
  }
  namespace :api do
    resources :user_projects, only: %i[index show create destroy]
    resources :users, only: %i[index show create update destroy]
    resources :todos, only: %i[index show create update destroy] do
      collection do
        patch 'batch_update'
      end
    end
    resources :categories, only: %i[index show create update destroy] do
      collection do
        patch 'batch_update'
      end
    end
    resources :projects, only: %i[index show create update destroy] do
      collection do
        patch 'batch_update'
      end
    end
  end

  get '/api/current_user', to: 'api/current_user#index'

  # patch '/api/todos/batch_update', to: 'api/todos#batch_update'
  # patch '/api/categories/batch_update', to: 'api/categories#batch_update'
  # patch '/api/projects/batch_update', to: 'api/projects#batch_update'

  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  get '/api/*path', to: 'fallback#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end
