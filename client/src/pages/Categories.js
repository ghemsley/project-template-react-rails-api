import React from 'react'
import { useSelector } from 'react-redux'
import CategoryForm from '../components/CategoryForm'
import { Category } from '../components/index'

const Categories = () => {
  const categories = useSelector(state => state.categories)

  return (
    <div className='center center-text category-page'>
      <div>
        <p>Create Category</p>
        <CategoryForm />
        <p>Categories</p>
      </div>
      <div className='flex category-container'>
        {categories.map(category => (
          <Category
            category={category}
            showDelete={true}
            showTodos={true}
            key={category.id}
          />
        ))}
      </div>
    </div>
  )
}

export default Categories
