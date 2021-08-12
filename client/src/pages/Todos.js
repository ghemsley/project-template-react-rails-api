import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import actions from '../actions'
import { ConfirmScreen, Todo } from '../components'
import {
  makeSelectCategoriesByCurrentUserID, makeSelectTodosByCurrentUserID
} from '../selectors'

const Todos = () => {
  const selectCategoriesByCurrentUserID = useCallback(
    makeSelectCategoriesByCurrentUserID,
    []
  )
  const categories = useSelector(state =>
    selectCategoriesByCurrentUserID(state)
  )
  const selectTodosByCurrentUserID = useCallback(
    makeSelectTodosByCurrentUserID,
    []
  )
  const todos = useSelector(state => selectTodosByCurrentUserID(state))
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.instantiateEverythingForUser())
  }, [dispatch])

  return categories.length < 1 ? (
    <ConfirmScreen>
      <p className='fit margin-auto'>
        Please create a category first before trying to create a todo!
      </p>
    </ConfirmScreen>
  ) : (
    <div className='center center-text todo-page'>
      <div className='button-container'>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: '/todos/new', state: { background: location } }}>
          Create Todo
        </Link>
      </div>
      {todos.length > 0 && <h1>Todos</h1>}
      <div className='flex todo-container'>
        {todos.map(todo => (
          <Todo todo={todo} showButtons showCategory key={`todo-${todo.id}`} />
        ))}
      </div>
    </div>
  )
}

export default Todos
