class CreateTodos < ActiveRecord::Migration[6.1]
  def change
    create_table :todos do |t|
      t.string :name
      t.string :description
      t.integer :order, default: 0
      t.references :category, null: false, foreign_key: true
      
      t.timestamps
    end
  end
end
