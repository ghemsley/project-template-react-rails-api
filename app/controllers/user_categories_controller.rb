class UserCategoriesController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id name description order project_id created_at updated_at]

    jsonapi_filter(User.find(params[:id]).categories, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: User.find(params[:user_id]).categories.find(params[:category_id])
  end
end
