import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDrag } from 'react-dnd'
import actions from '../actions/index'

const Todo = props => {
  const dispatch = useDispatch()
  const category = useSelector(state =>
    state.categories.find(category => category.id === props.todo.categoryID)
  )

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

  const handleButtonPointerDown = () => {
    dispatch(actions.deleteTodo({ id: props.todo.id }))
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
        <button
          className='pure-button pure-button-primary'
          onClick={handleButtonPointerDown}
        >
          Delete
        </button>
      )}
    </div>
  )
}

export default Todo
