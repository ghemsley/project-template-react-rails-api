class CategoryTodosController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[name description id category_id]
    jsonapi_filter(Category.find(params[:id]).todos, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    allowed = %i[name description id category_id]
    jsonapi_filter(Category.find(params[:category_id]).todos.find(params[:todo_id]), allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
