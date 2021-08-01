class ProjectCategoriesController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    render jsonapi: Project.find(params[:id]).categories
  end

  def show
    render jsonapi: Project.find(params[:project_id]).categories.find(params[:category_id])
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
