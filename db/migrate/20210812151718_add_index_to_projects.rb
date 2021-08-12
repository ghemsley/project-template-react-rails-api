class AddIndexToProjects < ActiveRecord::Migration[6.1]
  def change
    add_index :projects, :private
  end
end
