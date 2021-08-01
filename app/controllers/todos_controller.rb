class TodosController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    render jsonapi: Todo.all
  end

  def show
    render jsonapi: Todo.find(params[:id])
  end

  def create
    todo = Todo.create({ name: params[:name], description: params[:description],
                         category_id: params[:categoryID] })
    render jsonapi: todo
  end

  def update; end

  def destroy; end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
