class CategoryTodosController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    render jsonapi: Category.find(params[:id]).todos
  end

  def show
    render jsonapi: Category.find(params[:category_id]).todos.find(params[:todo_id])
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
