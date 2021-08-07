class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :rememberable, :validatable, :trackable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :user_projects, dependent: :destroy
  has_many :projects, through: :user_projects
  has_many :categories, through: :projects
  has_many :todos, through: :categories

  def url
    "http://localhost:3000/users/#{id}"
  end
end
