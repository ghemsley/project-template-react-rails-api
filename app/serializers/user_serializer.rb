class UserSerializer < ActiveModel::Serializer
  include JSONAPI::Serializer

  attributes :id, :username, :email, :created_at, :sign_in_count, :current_sign_in_at,
             :last_sign_in_at, :current_sign_in_ip, :last_sign_in_ip

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
