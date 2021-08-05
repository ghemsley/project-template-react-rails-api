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
    project = Project.create!({ name: params[:name], description: params[:description] })
    render jsonapi: project
  end

  def update
    project = Project.find(params[:id])
    project.update!(name: params[:name], description: params[:description])
    render jsonapi: project
  end

  def batch_update
    projects = params[:_json].collect do |json|
      Project.find(json[:id])
    end
    projects.each_with_index do |project, index|
      json = params[:_json][index]
      project.update!(name: json[:name], description: json[:description], order: json[:order])
    end
    render jsonapi: projects
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
