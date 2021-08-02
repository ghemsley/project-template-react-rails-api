class ProjectUsersController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id username created_at]
    jsonapi_filter(Project.find(params[:id]).users, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: Project.find(params[:project_id]).users.find(params[:user_id])
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
