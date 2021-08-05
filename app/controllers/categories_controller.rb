class CategoriesController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id name description order project_id created_at updated_at]

    jsonapi_filter(Category.all, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: Category.find(params[:id])
  end

  def create
    category = Category.create!({ name: params[:name], description: params[:description],
                                  project_id: params[:projectID] })
    render jsonapi: category
  end

  def update
    category = Category.find(params[:id])
    category.update!(name: params[:name], description: params[:description], order: params[:order],
                     project_id: params[:projectID])
    render jsonapi: category
  end

  def batch_update
    categories = params[:_json].collect do |json|
      Category.find(json[:id])
    end
    categories.each_with_index do |category, index|
      json = params[:_json][index]
      category.update!(name: json[:name], description: json[:description], order: json[:order],
                       project_id: json[:projectID])
    end
    render jsonapi: categories
  end

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
