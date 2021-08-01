class TodoCategoryController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def show
    allowed = %i[name description id project_id]

    jsonapi_filter(Todo.find(params[:id]).category, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
