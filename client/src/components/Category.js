import React, { useMemo } from 'react'
import { useDrag } from 'react-dnd'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../actions/index'
import { Todo, Dropzone } from './index'

const Category = props => {
  const dispatch = useDispatch()
  const todos = useSelector(state =>
    state.todos.filter(todo => todo.categoryID === props.category.id)
  )

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
    dispatch(actions.updateTodo({ ...item, categoryID: props.category.id }))
  }

  const handleButtonPointerDown = () => {
    dispatch(actions.deeplyDeleteCategory({ id: props.category.id }))
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
        {props.showDelete && (
          <button
            className='pure-button pure-button-primary delete-button'
            onClick={handleButtonPointerDown}
          >
            Delete
          </button>
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
                      showDelete={props.showDelete}
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
