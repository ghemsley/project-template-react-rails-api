class UserTodosController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id name description category_id created_at updated_at]

    jsonapi_filter(User.find(params[:id]).todos, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: User.find(params[:user_id]).todos.find(params[:todo_id])
  end
end
