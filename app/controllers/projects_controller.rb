class ProjectsController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id name description order created_at updated_at]

    jsonapi_filter(current_user.projects, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: current_user.projects.find(params[:id])
  end

  def create
    project = current_user.projects.create!({ name: params[:name], description: params[:description] })
    render jsonapi: project
  end

  def update
    project = current_user.projects.find(params[:id])
    project.update!(name: params[:name], description: params[:description], order: params[:order])
    render jsonapi: project
  end

  def batch_update
    projects = params[:_json].collect do |json|
      current_user.projects.find(json[:id])
    end
    projects.each_with_index do |project, index|
      json = params[:_json][index]
      project.update!(name: json[:name], description: json[:description], order: json[:order])
    end
    render jsonapi: projects
  end

  def destroy
    project = current_user.projects.find(params[:id])
    project.destroy!
    render jsonapi: project
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
