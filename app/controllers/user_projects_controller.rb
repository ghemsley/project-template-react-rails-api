class UserProjectsController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id user_id project_id created_at updated_at]

    jsonapi_filter(UserProject.all, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: UserProject.find(params[:id])
  end

  def create
    user_project = UserProject.create!(user_id: params[:userID], project_id: params[:projectID])
    render jsonapi: user_project
  end

  def update; end

  def destroy
    user_project = UserProject.find_by!(user_id: params[:userID], project_id: params[:project_id])
    user_project.destroy!
    render jsonapi: user_project
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
