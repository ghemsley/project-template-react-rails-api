class Category < ApplicationRecord
  belongs_to :project
  has_many :todos

  def url
    "http://localhost:3000/categories/#{id}"
  end
end
