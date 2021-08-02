class UserProjectSerializer < ActiveModel::Serializer
  include JSONAPI::Serializer
  
  attributes :id, :user_id, :project_id

  belongs_to :user, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/users/#{object.user_id}"
    }
  }

  belongs_to :project, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/projects/#{object.project_id}"
    }
  }
end
