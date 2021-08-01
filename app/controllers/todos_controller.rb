class TodosController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[name description id category_id]

    jsonapi_filter(Todo.all, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    allowed = %i[name description id category_id]

    jsonapi_filter(Todo.find(params[:id]), allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def create
    todo = Todo.create({ name: params[:name], description: params[:description],
                         category_id: params[:categoryID] })
    render jsonapi: todo
  end

  def update; end

  def destroy
    todo = todo.find(params[:id])
    todo.destroy!
    render jsonapi: todo
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
