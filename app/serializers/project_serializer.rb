class ProjectSerializer < ActiveModel::Serializer
  include JSONAPI::Serializer

  attributes :id, :name, :description, :order, :private, :created_at, :updated_at

  has_many :categories, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/projects/#{object.id}?include=categories"
    }
  }

  has_many :todos, through: :categories, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/projects/#{object.id}?include=todos"
    }
  }

  has_many :user_projects, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/projects/#{object.id}/include=user_projects"
    }
  }

  has_many :users, through: :user_projects, links: {
    self: :url,
    related: lambda { |object|
      "http://localhost:3000/projects/#{object.id}?include=users"
    }
  }

  cache_options store: ActiveSupport::Cache::MemoryStore.new, expires_in: 5.minutes
end
