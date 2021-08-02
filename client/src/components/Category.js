import React, { useMemo, useState } from 'react'
import { useDrag } from 'react-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import actions from '../actions/index'
import { Todo, Dropzone, ConfirmScreen } from './index'

const Category = props => {
  const dispatch = useDispatch()
  const todos = useSelector(state =>
    state.todos.filter(todo => todo.categoryID === props.category.id)
  )
  const project = useSelector(state =>
    state.projects.find(project => project.id === props.category.projectID)
  )
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)
  const location = useLocation()

  const [{ dragging, position }, drag, dragPreview] = useDrag(() => ({
    type: 'CATEGORY',
    item: props.category,
    previewOptions: { captureDraggingState: true },
    collect: monitor => ({
      dragging: monitor.isDragging(),
      position: monitor.getSourceClientOffset()
    })
  }))

  const style = useMemo(
    () => ({ background: dragging ? '#1070b0' : '#1060a0' }),
    [dragging]
  )

  const handleDrop = (item, position) => {
    dispatch(actions.amendTodo({ ...item, categoryID: props.category.id }))
  }
  const handleClick = () => {
    setShowConfirmScreen(true)
  }
  const closeAction = () => {
    setShowConfirmScreen(false)
  }
  const confirmRemove = () => {
    dispatch(actions.removeCategory(props.category))
  }

  return (
    <div
      id={props.category.id}
      className='hoverable flex-child rounded category'
      style={{
        color: 'whitesmoke',
        transition: 'background-color 150ms ease',
        ...style
      }}
      ref={drag}
    >
      <Dropzone handleDrop={handleDrop} acceptType='TODO'>
        <h2>{props.category.name}</h2>
        <p>{props.category.description}</p>
        {props.showProject && (
          <p>
            <strong>Project:</strong> {project.name}
          </p>
        )}
        {props.showButtons && (
          <>
            <div className='button-container'>
              <Link
                className={`pure-button pure-button-primary invisible`}
                to={{
                  pathname: `categories/${props.category.id}/edit`,
                  state: { background: location, edit: props.category }
                }}
              >
                Edit
              </Link>
              <button
                className={`pure-button pure-button-delete invisible`}
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
        {props.showTodos && (
          <>
            {todos.length < 1 ? (
              <>
                <h3>Todos</h3>
                <p style={{ fontSize: '14px' }}>Drop todos here!</p>
              </>
            ) : (
              <>
                <h3>Todos</h3>
                <div className='flex column todo-container'>
                  {todos.map(todo => (
                    <Todo
                      draggable
                      todo={todo}
                      showButtons={props.showButtons}
                      key={todo.id}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </Dropzone>
    </div>
  )
}

export default Category
