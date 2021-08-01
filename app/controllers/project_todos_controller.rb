class ProjectTodosController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    render jsonapi: Project.find(params[:id]).todos
  end

  def show
    render jsonapi: Project.find(params[:project_id]).todos.find(params[:todo_id])
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
