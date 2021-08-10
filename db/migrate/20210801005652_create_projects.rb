class CreateProjects < ActiveRecord::Migration[6.1]
  def change
    create_table :projects do |t|
      t.string :name
      t.string :description
      t.integer :order, default: 0, null: false

      t.timestamps
    end
  end
end
