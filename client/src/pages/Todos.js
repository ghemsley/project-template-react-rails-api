import React from 'react'
import { useSelector } from 'react-redux'
import TodoForm from '../components/TodoForm'
import Todo from '../components/Todo'
import { Link, useLocation } from 'react-router-dom'

const Todos = () => {
  const todos = useSelector(state => state.todos)
  const location = useLocation()

  return (
    <div className='center center-text todo-page'>
      <div>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: 'todos/new', state: { background: location } }}
        >
          Create Todo
        </Link>
        {todos.length > 0 && <h1>Todos</h1>}
      </div>
      <div className='flex todo-container'>
        {todos.map(todo => (
          <Todo todo={todo} showDelete={true} key={todo.id} />
        ))}
      </div>
    </div>
  )
}

export default Todos
