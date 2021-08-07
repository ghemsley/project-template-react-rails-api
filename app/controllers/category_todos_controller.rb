class CategoryTodosController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id name description order category_id created_at updated_at]
    jsonapi_filter(current_user.categories.find(params[:id]).todos, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: current_user.categories.find(params[:category_id]).todos.find(params[:todo_id])
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
