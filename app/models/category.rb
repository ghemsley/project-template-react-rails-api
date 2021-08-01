class Category < ApplicationRecord
  belongs_to :project
  has_many :todos
end
