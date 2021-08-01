class ProjectSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attributes :name, :description

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

  cache_options store: ActiveSupport::Cache::MemoryStore.new, expires_in: 5.minutes
end
