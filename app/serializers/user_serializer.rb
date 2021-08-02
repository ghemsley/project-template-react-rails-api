class UserSerializer < ActiveModel::Serializer
  include JSONAPI::Serializer
  
  attributes :id, :username, :created_at

  has_many :projects, through: :user_projects, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/users/#{object.id}/projects"
    }
  }

  has_many :categories, through: :projects, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/users/#{object.id}/categories"
    }
  }

  has_many :todos, through: :categories, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/users/#{object.id}/todos"
    }
  }
end
