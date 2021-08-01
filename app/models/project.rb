class Project < ApplicationRecord
  has_many :categories
  has_many :todos, through: :categories

  def url
    "http://localhost:3000/projects/#{id}"
  end
end
