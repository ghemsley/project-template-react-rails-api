class TodoSerializer
  include JSONAPI::Serializer
  set_key_transform :camel_lower

  attributes :name, :description

  belongs_to :category, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/categories/#{object.category_id}"
    }
  }

  cache_options store: ActiveSupport::Cache::MemoryStore.new, expires_in: 5.minutes
end