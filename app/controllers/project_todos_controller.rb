class ProjectTodosController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id name description category_id created_at updated_at]
    jsonapi_filter(Project.find(params[:id]).todos, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    allowed = %i[id name description category_id created_at updated_at]
    jsonapi_filter(Project.find(params[:project_id]).todos.find(params[:todo_id]).todos, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
