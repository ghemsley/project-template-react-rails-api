class User < ApplicationRecord
  has_secure_password
  has_many :user_projects, dependent: :destroy
  has_many :projects, through: :user_projects
  has_many :categories, through: :projects
  has_many :todos, through: :categories

  def url
    "http://localhost:3000/users/#{id}"
  end
end
