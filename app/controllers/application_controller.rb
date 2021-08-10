class ApplicationController < ActionController::API
  include ActionController::Cookies
  before_action :authenticate_user!
end
