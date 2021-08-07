class CategoryProjectController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def show
    render jsonapi: current_user.categories.find(params[:id]).project
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
