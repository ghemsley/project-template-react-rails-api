class Api::CurrentUserController < ApplicationController
  def index
    render json: {
      user: UserSerializer.new(current_user).serializable_hash,
      status: { code: 200, message: 'Session active' }
    }, status: :ok
  end
end
