class ProjectsController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering
  skip_before_action :authenticate_user!, only: [:index]

  def index
    allowed = %i[id name description order created_at updated_at]
    jsonapi_filter(Project.all, allowed) do |filtered|
      render jsonapi: filtered.result, status: :ok
    end
  end

  def show
    render jsonapi: Project.find(params[:id])
  end

  def create
    project = current_user.projects.create!({ name: params[:name], description: params[:description] })
    user_project = UserProject.create!(user_id: current_user.id, project_id: project.id)
    render json: { user: UserSerializer.new(current_user).serializable_hash,
                   project: ProjectSerializer.new(project).serializable_hash,
                   user_project: UserProjectSerializer.new(user_project).serializable_hash }, status: :ok
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
