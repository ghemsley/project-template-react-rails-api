class CategorySerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attributes :name, :description

  belongs_to :project, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/projects/#{object.project_id}"
    }
  }

  has_many :todos, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/categories/#{object.id}/todos"
    }
  }

  cache_options store: ActiveSupport::Cache::MemoryStore.new, expires_in: 5.minutes
end