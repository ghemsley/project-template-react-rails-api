import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDrag } from 'react-dnd'
import actions from '../actions/index'
import { ConfirmScreen } from './index'
import { Link, useLocation } from 'react-router-dom'

const Todo = props => {
  const dispatch = useDispatch()
  const category = useSelector(state =>
    state.categories.find(category => category.id === props.todo.categoryID)
  )
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)
  const location = useLocation()

  const [{ dragging, coordinates }, drag, dragPreview] = useDrag(() => ({
    type: 'TODO',
    item: props.todo,
    previewOptions: { captureDraggingState: true },
    collect: monitor => ({
      dragging: monitor.isDragging(),
      coordinates: monitor.getSourceClientOffset()
    })
  }))

  const style = useMemo(
    () => ({ background: dragging ? '#10a0f0' : '#1090d0' }),
    [dragging]
  )

  const handleClick = () => {
    setShowConfirmScreen(true)
  }
  const closeAction = () => {
    setShowConfirmScreen(false)
  }
  const confirmRemove = () => {
    dispatch(actions.removeTodo(props.todo))
  }

  return (
    <div
      id={props.todo.id}
      className='hoverable flex-child rounded todo'
      style={{
        color: 'whitesmoke',
        transition: 'background-color 150ms ease',
        ...style
      }}
      ref={drag}
    >
      <h2>{props.todo.name}</h2>
      <p>{props.todo.description}</p>
      {props.showCategory && (
        <p>
          <strong>Category:</strong> {category.name}
        </p>
      )}
      {props.showButtons && (
        <>
          <div className='button-container'>
            <Link
              className='pure-button pure-button-primary'
              to={{
                pathname: `todos/${props.todo.id}/edit`,
                state: { background: location, edit: props.todo }
              }}
            >
              Edit
            </Link>
            <button
              className='pure-button pure-button-delete'
              onClick={handleClick}
            >
              Delete
            </button>
          </div>
          {showConfirmScreen && (
            <ConfirmScreen closeAction={closeAction}>
              <h1>Confirm delete?</h1>
              <button
                className='pure-button pure-button-delete'
                onClick={confirmRemove}
              >
                Delete
              </button>
            </ConfirmScreen>
          )}
        </>
      )}
    </div>
  )
}

export default Todo
