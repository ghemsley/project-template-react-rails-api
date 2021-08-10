class CreateCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :categories do |t|
      t.string :name
      t.string :description
      t.integer :order, default: 0, null: false
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
