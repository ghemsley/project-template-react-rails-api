# Controller logic: fallback requests for React Router.
# Leave this here to help deploy your app later!
class FallbackController < ApplicationController
  skip_before_action :authenticate_user!
  def index
    # React app index page
    render file: 'client/public/index.html'
  end
end
