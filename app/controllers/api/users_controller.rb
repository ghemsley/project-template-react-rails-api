class Api::UsersController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id username email created_at remember_created_at sign_in_count current_sign_in_at last_sign_in_at
                 current_sign_in_ip last_sign_in_ip]

    jsonapi_filter(User.all, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: User.find(params[:id])
  end

  def create
    user = User.create!({ username: params[:username], email: params[:email], password: params[:password],
                          password_confirmation: params[:password_confirmation] })
    render jsonapi: user
  end

  def update; end

  def destroy
    user = User.find(params[:id])
    user.destroy!
    render jsonapi: user
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
