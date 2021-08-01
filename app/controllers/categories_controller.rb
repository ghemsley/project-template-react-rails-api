class CategoriesController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[name description id project_id]

    jsonapi_filter(Category.all, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    allowed = %i[name description id project_id]

    jsonapi_filter(Category.find(params[:id]), allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def create
    category = Category.create({ name: params[:name], description: params[:description],
                                 project_id: params[:projectID] })
    render jsonapi: category
  end

  def update; end

  def destroy
    category = Category.find(params[:id])
    category.destroy!
    render jsonapi: category
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
