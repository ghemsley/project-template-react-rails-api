class Api::UserProjectsController < ApplicationController
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
    owner = if UserProject.where(owner: true, project_id: params[:project_id]).count.zero?
              true
            else
              false
            end
    user_project = UserProject.create!(user_id: current_user.id, project_id: params[:project_id], owner: owner)
    render jsonapi: user_project
  end

  def update; end

  def destroy
    user_project = UserProject.find(params[:id])
    user_project.destroy!
    render jsonapi: user_project
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
