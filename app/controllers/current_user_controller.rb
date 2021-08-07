class CurrentUserController < ApplicationController
  def index
    render json: {
      data: UserSerializer.new(current_user).serializable_hash,
      status: { code: 200, message: 'Session active' }
    }, status: :ok
  end
end
