class ProjectCategoriesController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id name description order project_id created_at updated_at]
    jsonapi_filter(current_user.projects.find(params[:id]).categories, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: current_user.projects.find(params[:project_id]).categories.find(params[:category_id])
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
