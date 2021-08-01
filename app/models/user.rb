class User < ApplicationRecord
  has_secure_password
  has_many :projects, through: :user_projects

  def url
    "http://localhost:3000/users/#{id}"
  end
end
