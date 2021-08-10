class Api::TodosController < ApplicationController
  include JSONAPI::Fetching
  include JSONAPI::Filtering

  def index
    allowed = %i[id name description order category_id created_at updated_at category_project_id category_project_user_project_id category_project_user_project_user_id]

    jsonapi_filter(Todo.all, allowed) do |filtered|
      render jsonapi: filtered.result
    end
  end

  def show
    render jsonapi: Todo.find(params[:id])
  end

  def create
    todo = Todo.create!({ name: params[:name], description: params[:description],
                          category_id: params[:categoryID] })
    render jsonapi: todo
  end

  def update
    todo = current_user.todos.find(params[:id])
    todo.update!(name: params[:name], description: params[:description], order: params[:order],
                 category_id: params[:categoryID])
    render jsonapi: todo
  end

  def batch_update
    todos = params[:_json].collect do |json|
      current_user.todos.find(json[:id])
    end
    todos.each_with_index do |todo, index|
      json = params[:_json][index]
      todo.update!(name: json[:name], description: json[:description], order: json[:order],
                   category_id: json[:categoryID])
    end
    render jsonapi: todos
  end

  def destroy
    todo = current_user.todos.find(params[:id])
    todo.destroy!
    render jsonapi: todo
  end

  private

  def jsonapi_meta(resources)
    { total: resources.count } if resources.respond_to?(:count)
  end
end
