import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Category } from '../components/index'
import { Link, useLocation } from 'react-router-dom'
import actions from '../actions'
import {
  makeSelectCategoriesByCurrentUserID,
  makeSelectProjectsByCurrentUserID
} from '../selectors'

const Categories = () => {
  const selectProjectsByCurrentUserID = useCallback(
    makeSelectProjectsByCurrentUserID,
    []
  )
  const selectCategoriesByCurrentUserID = useCallback(
    makeSelectCategoriesByCurrentUserID,
    []
  )
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
    <p className='fit margin-auto'>
      Please create a project first before trying to create a category!
    </p>
  ) : (
    <div className='center center-text category-page'>
      <div className='button-container'>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: '/categories/new', state: { background: location } }}>
          Create Category
        </Link>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: '/todos/new', state: { background: location } }}>
          Create Todo
        </Link>
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
