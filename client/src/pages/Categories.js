import React from 'react'
import { useSelector } from 'react-redux'
import { Category } from '../components/index'
import { Link, useLocation } from 'react-router-dom'

const Categories = () => {
  const categories = useSelector(state => state.categories)
  const location = useLocation()

  return (
    <div className='center center-text category-page'>
      <div>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: 'categories/new', state: { background: location } }}
        >
          Create Category
        </Link>
        {categories.length > 0 && <h1>Categories</h1>}
      </div>
      <div className='flex category-container'>
        {categories.map(category => (
          <Category
            category={category}
            showDelete
            showTodos
            showProject
            key={category.id}
          />
        ))}
      </div>
    </div>
  )
}

export default Categories
