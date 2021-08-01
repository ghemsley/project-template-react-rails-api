class ProjectsController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    render jsonapi: Project.all
  end

  def show
    render jsonapi: Project.find(params[:id])
  end

  def create
    project = Project.create({ name: params[:name], description: params[:description] })
    render jsonapi: project
  end

  def update
  end

  def destroy
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
