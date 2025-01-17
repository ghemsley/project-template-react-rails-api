# frozen_string_literal: true

class Api::Users::SessionsController < Devise::SessionsController
  respond_to :json
  skip_before_action :authenticate_user!
  before_action :configure_sign_in_params

  # # GET /resource/sign_in
  # def new
  #   super
  # end

  # # POST /resource/sign_in
  # def create
  #   super
  # end

  # # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
  protected

  def configure_sign_in_params
    devise_parameter_sanitizer.permit(:sign_in, keys: %i[email password])
  end

  private

  def respond_with(resource, _opts = {})
    render json: {
      user: UserSerializer.new(resource).serializable_hash,
      status: { code: 200, message: 'Logged in sucessfully.' }
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: 200,
        message: 'Logged out successfully'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session"
      }, status: :unauthorized
    end
  end
end
