class TodoCategoryController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def show
    render jsonapi: Todo.find(params[:id]).category
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
