import React from 'react'
import { useSelector } from 'react-redux'
import CategoryForm from '../components/CategoryForm'
import Category from '../components/Category'

const Categories = () => {
  const categories = useSelector(state => state.categories)
  return (
    <div className='center center-text category-page'>
      <div>
        <p>Create Category</p>
        <CategoryForm />
        <p>Categories</p>
      </div>
      <div className='flex'>
        {categories.map((category, i) => (
          <Category
            category={category}
            showDelete={true}
            showTodos={true}
            key={i}
          />
        ))}
      </div>
    </div>
  )
}

export default Categories
