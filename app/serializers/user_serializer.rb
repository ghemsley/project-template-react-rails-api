class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :created_at

  has_many :projects, through: :user_projects, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/users/#{object.id}/projects"
    }
  }
end
