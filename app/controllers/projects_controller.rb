class ProjectsController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[name description id]

    jsonapi_filter(Project.all, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    allowed = %i[name description id]

    jsonapi_filter(Project.find(params[:id]), allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def create
    project = Project.create({ name: params[:name], description: params[:description] })
    render jsonapi: project
  end

  def update
  end

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
