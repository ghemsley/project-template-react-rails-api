class CreateUserProjects < ActiveRecord::Migration[6.1]
  def change
    create_table :user_projects do |t|
      t.references :user, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.boolean :owner, default: false, null: false

      t.timestamps
    end
    add_index :user_projects, [:user_id, :project_id], unique: true
  end
end
