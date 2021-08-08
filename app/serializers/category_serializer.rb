class CategorySerializer < ActiveModel::Serializer
  include JSONAPI::Serializer

  attributes :id, :name, :description, :order, :project_id, :created_at, :updated_at

  belongs_to :project, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/categories/#{object.id}?include=project"
    }
  }

  has_many :todos, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/categories/#{object.id}?include=todos"
    }
  }

  cache_options store: ActiveSupport::Cache::MemoryStore.new, expires_in: 5.minutes
end
