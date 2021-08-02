import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDrag } from 'react-dnd'
import actions from '../actions/index'
import { ConfirmScreen } from './index'

const Todo = props => {
  const dispatch = useDispatch()
  const category = useSelector(state =>
    state.categories.find(category => category.id === props.todo.categoryID)
  )
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)

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

  const confirmRemoveTodo = () => {
    dispatch(actions.removeTodo(props.todo))
  }

  const handleClick = () => {
    setShowConfirmScreen(true)
  }

  const closeAction = () => {
    setShowConfirmScreen(false)
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
      {props.showDelete && (
        <>
          <button
            className='pure-button pure-button-primary'
            onClick={handleClick}
          >
            Delete
          </button>
          {showConfirmScreen && (
            <ConfirmScreen closeAction={closeAction}>
              <h1>Confirm delete?</h1>
              <button
                className='pure-button pure-button-primary'
                onClick={confirmRemoveTodo}
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
