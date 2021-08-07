class CurrentUserController < ApplicationController
  def index
    render jsonapi: current_user, status: :ok
  end
end
