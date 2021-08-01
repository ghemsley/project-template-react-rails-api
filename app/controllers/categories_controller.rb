class CategoriesController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    render jsonapi: Category.all
  end

  def show
    render jsonapi: Category.find(params[:id])
  end

  def create
    category = Category.create({ name: params[:name], description: params[:description],
                                 project_id: params[:projectID] })
    render jsonapi: category
  end

  def update; end

  def destroy; end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
