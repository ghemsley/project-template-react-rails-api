class CategoryProjectController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def show
    allowed = %i[name description id]
    jsonapi_filter(Category.find(params[:category_id]).project, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
