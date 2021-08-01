class Project < ApplicationRecord
  has_many :categories
  has_many :todos, through: :categories
end
