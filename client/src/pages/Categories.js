import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import actions from '../actions'
import { Category, ConfirmScreen } from '../components'
import selectors from '../selectors'

const Categories = () => {
  const selectProjectsByCurrentUserID =
    selectors.makeSelectProjectsByCurrentUserId
  const selectCategoriesByCurrentUserID =
    selectors.makeSelectCategoriesByCurrentUserId
  const projects = useSelector(state => selectProjectsByCurrentUserID(state))
  const categories = useSelector(state =>
    selectCategoriesByCurrentUserID(state)
  )
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.instantiateEverythingForUser())
  }, [dispatch])

  return projects.length < 1 ? (
    <ConfirmScreen>
      <p className='fit margin-auto'>
        Please create a project first before trying to create a category!
      </p>
    </ConfirmScreen>
  ) : (
    <div className='center center-text category-page'>
      <div className='button-container'>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: '/categories/new', state: { background: location } }}>
          Create Category
        </Link>
        {categories.length > 0 && (
          <Link
            className='pure-button pure-button-primary'
            to={{ pathname: '/todos/new', state: { background: location } }}>
            Create Todo
          </Link>
        )}
      </div>
      {categories.length > 0 && <h1>Categories</h1>}
      <div className='flex category-container'>
        {categories.map(category => (
          <Category
            category={category}
            showButtons
            showTodos
            showProject
            key={`category-${category.id}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Categories
