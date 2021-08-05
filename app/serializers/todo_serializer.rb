class TodoSerializer
  include JSONAPI::Serializer

  attributes :id, :name, :description, :order, :category_id, :created_at, :updated_at

  belongs_to :category, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/categories/#{object.category_id}"
    }
  }

  cache_options store: ActiveSupport::Cache::MemoryStore.new, expires_in: 5.minutes
end
