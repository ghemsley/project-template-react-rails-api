class ProjectsController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id name description created_at updated_at]

    jsonapi_filter(Project.all, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: Project.find(params[:id])
  end

  def create
    project = Project.create({ name: params[:name], description: params[:description] })
    render jsonapi: project
  end

  def update; end

  def destroy
    project = Project.find(params[:id])
    project.destroy!
    render jsonapi: project
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
