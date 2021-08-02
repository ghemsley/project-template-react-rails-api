class Project < ApplicationRecord
  has_many :categories, dependent: :destroy
  has_many :todos, through: :categories
  has_many :user_projects, dependent: :destroy
  has_many :users, through: :user_projects

  def url
    "http://localhost:3000/projects/#{id}"
  end
end
