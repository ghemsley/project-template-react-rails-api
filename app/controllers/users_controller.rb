class UsersController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id username created_at]

    jsonapi_filter(User.all, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    allowed = %i[id username created_at]

    jsonapi_filter(User.find(params[:id]), allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def create
    user = User.create({ username: params[:username], password: params[:password],
                         password_confirmation: params[:passwordConfirmation] })
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