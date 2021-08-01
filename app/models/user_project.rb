class UserProject < ApplicationRecord
  belongs_to :user
  belongs_to :project

  def url 
    "http://localhost:3000/user_projects/#{id}"
  end
end
