class UserProjectSerializer < ActiveModel::Serializer
  include JSONAPI::Serializer

  attributes :id, :user_id, :project_id, :owner, :created_at

  belongs_to :user, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/user_projects/#{object.id}?include=user"
    }
  }

  belongs_to :project, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/user_projects/#{object.project_id}?include=project"
    }
  }

  cache_options store: ActiveSupport::Cache::MemoryStore.new, expires_in: 5.minutes
end
