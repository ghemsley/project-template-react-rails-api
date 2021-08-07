class UserProjectsController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id user_id project_id created_at updated_at]

    jsonapi_filter(current_user.user_projects, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def index_user_projects
    allowed = %i[id name description order created_at updated_at]

    jsonapi_filter(User.find(params[:id]).projects, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: current_user.user_projects.find(params[:id])
  end

  def show_user
    render jsonapi: current_user.user_projects.find(params[:id]).user
  end

  def show_project
    render jsonapi: current_user.user_projects.find(params[:id]).project
  end

  def show_user_project
    render jsonapi: User.find(params[:user_id]).projects.find(params[:project_id])
  end

  def create
    user_project = UserProject.create!(user_id: current_user.id, project_id: params[:project_id])
    render jsonapi: user_project
  end

  def update; end

  def destroy
    user_project = UserProject.find_by!(user_id: current_user.id, project_id: params[:project_id])
    user_project.destroy!
    render jsonapi: user_project
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
