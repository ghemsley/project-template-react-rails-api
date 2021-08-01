class Todo < ApplicationRecord
  belongs_to :category

  def url
    "http://localhost:3000/todos/#{id}"
  end
end
