import React from 'react'
import { useSelector } from 'react-redux'
import TodoForm from '../components/TodoForm'
import Todo from '../components/Todo'

const Todos = () => {
  const todos = useSelector(state => state.todos)

  return (
    <div className='center center-text todo-page'>
      <div>
        <p>Create Todo</p>
        <TodoForm />
        <p>Todos</p>
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
