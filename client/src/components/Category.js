import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useDrag } from 'react-dnd'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../actions/index'
import { Todo, Hover, Project, Dropzone } from './index'

const Category = props => {
  const todos = useSelector(state =>
    state.todos.filter(todo => todo.categoryID === props.category.id)
  )
  const projects = useSelector(state => state.projects)
  const dispatch = useDispatch()
  const coordinatesRef = useRef(null)

  const handleButtonPointerDown = () => {
    dispatch(actions.deeplyDeleteCategory({ id: props.category.id }))
  }

  useLayoutEffect(() => {
    if (coordinatesRef.current) {
      const rect = coordinatesRef.current.getBoundingClientRect()
      const coordinates = {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom
      }
      if (coordinates !== props.category.coordinates) {
        dispatch(actions.updateCategory({ ...props.category, coordinates }))
      }
    }
  }, [props.category, dispatch])

  const [{ dragging, position }, drag, dragPreview] = useDrag(() => ({
    type: 'CATEGORY',
    item: props.category,
    previewOptions: {captureDraggingState: true},
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

  return (
    <div
      id={props.category.id}
      className='hoverable flex-child radius-4 category'
      style={{
        color: 'whitesmoke',
        transition: 'background-color 50ms ease',
        ...style
      }}
      ref={drag}
    >
      <div ref={coordinatesRef} className='height-100'>
        <Dropzone handleDrop={handleDrop} acceptType='TODO'>
          <h2>{props.category.name}</h2>
          <p>{props.category.description}</p>
          {props.showDelete && !dragging && (
            <button
              className='pure-button pure-button-primary animate-height'
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
                        todo={todo}
                        draggable={true}
                        showDelete={props.showDelete && !dragging}
                        key={todo.id}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </Dropzone>
        {props.hoverable && !dragging && (
          <Hover>
            <Project
              project={projects.find(
                project => project.id === props.category.projectID
              )}
              showCategories={true}
            />
          </Hover>
        )}
      </div>
    </div>
  )
}

export default Category
