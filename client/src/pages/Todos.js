import React from 'react'
import { useSelector } from 'react-redux'
import Todo from '../components/Todo'
import { Link, useLocation } from 'react-router-dom'

const Todos = () => {
  const todos = useSelector(state => state.todos)
  const location = useLocation()

  return (
    <div className='center center-text todo-page'>
      <div className='button-container'>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: 'todos/new', state: { background: location } }}
        >
          Create Todo
        </Link>
      </div>
      {todos.length > 0 && <h1>Todos</h1>}
      <div className='flex todo-container'>
        {todos.map(todo => (
          <Todo
            todo={todo}
            showButtons
            showCategory
            key={`todo-${todo.id}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Todos
