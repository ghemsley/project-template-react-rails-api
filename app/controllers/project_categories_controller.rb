class ProjectCategoriesController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[name description id project_id]
    jsonapi_filter(Project.find(params[:id]).categories, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    allowed = %i[name description id project_id]
    jsonapi_filter(Project.find(params[:project_id]).categories.find(params[:category_id]), allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
