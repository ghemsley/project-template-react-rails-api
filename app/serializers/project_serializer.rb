class ProjectSerializer
  include JSONAPI::Serializer

  attributes :id, :name, :description, :order, :created_at, :updated_at

  has_many :categories, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/projects/#{object.id}/categories"
    }
  }

  has_many :todos, through: :categories, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/projects/#{object.id}/todos"
    }
  }

  has_many :users, through: :user_projects, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/projects/#{object.id}/users"
    }
  }

  cache_options store: ActiveSupport::Cache::MemoryStore.new, expires_in: 5.minutes
end
