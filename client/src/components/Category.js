import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { Todo, Dropzone, ConfirmScreen } from './index'
import useResizeObserver from 'use-resize-observer'
import mergeRefs from 'react-merge-refs'
import actions from '../actions/index'
import { debounce } from 'lodash'

const Category = props => {
  const todos = useSelector(state =>
    state.todos.filter(todo => todo.categoryID === props.category.id)
  )
  const project = useSelector(state =>
    state.projects.find(project => project.id === props.category.projectID)
  )
  const coordinates = useSelector(state => state.coordinates)
  const categoryCoordinates = useSelector(state =>
    state.coordinates.find(
      coords =>
        coords.type === 'category' && coords.item.id === props.category.id
    )
  )
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)
  const [order, setOrder] = useState(0)
  const location = useLocation()
  const dispatch = useDispatch()
  const ref = useRef(null)

  const [{ dragging, position }, drag, dragPreview] = useDrag(() => ({
    type: 'category',
    item: props.category,
    previewOptions: { captureDraggingState: true },
    collect: monitor => ({
      dragging: monitor.isDragging(),
      position: monitor.getSourceClientOffset()
    }),
    options: { dropEffect: 'copy' },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        console.log('result', monitor.getDropResult())
      }
    }
  }))

  const getCoordinates = useCallback(
    size => {
      if (ref.current) {
        console.log('resize category')
        const rect = ref.current.getBoundingClientRect()
        const coordinates = {
          type: 'category',
          item: props.category,
          position: {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom,
            width: size.width,
            height: size.height,
            rectWidth: rect.width,
            rectHeight: rect.height
          }
        }
        dispatch(actions.refreshCoordinates(coordinates))
      }
    },
    [props.category, dispatch]
  )

  const onResize = debounce(
    size => {
      getCoordinates(size)
    },
    100,
    { trailing: true, maxWait: 250 }
  )

  const onSroll = debounce(size => getCoordinates(size), 250, {
    trailing: true,
    maxWait: 500
  })

  const observer = useResizeObserver({ ref, onResize })

  useEffect(() => {
    document.addEventListener('scroll', () =>
      onSroll({ width: observer.width, height: observer.height })
    )
    return () => {
      document.removeEventListener('scroll', () =>
        onSroll({ width: observer.width, height: observer.height })
      )
    }
  }, [])

  const handleDrop = (item, result) => {
    const todoCoordsArray = coordinates.filter(
      coords =>
        coords.type === 'todo' && coords.item.categoryID === props.category.id
    )
    for (const coords of todoCoordsArray) {
      if (coords.item.id !== item.id) {
        if (result.cursor.y > coords.position.top) {
          console.log('cursor is below', {
            element: coords.position.top,
            cursor: result.cursor.y
          })
        } else {
          console.log('cursor is above', {
            element: coords.position.top,
            cursor: result.cursor.y
          })
        }
      }
    }
    const todo = { ...item, categoryID: props.category.id }
    if (item.categoryID !== props.category.id) {
      dispatch(actions.amendTodo(todo))
    }
    // todoCoordsArray.sort((coord1, coord2) => {
    //   if (coord1.order > coord2.order) {
    //     return 1
    //   } else if (coord1.order < coord2.order) {
    //     return -1
    //   } else return 0
    // })
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

  const style = useMemo(
    () => ({ background: dragging ? '#1070b0' : '#1060a0' }),
    [dragging]
  )

  return (
    <div
      id={`category-${props.category.id}`}
      className='hoverable flex-child rounded category'
      style={{
        color: 'whitesmoke',
        transition: 'background-color 150ms ease',
        ...style
      }}
      ref={dragging ? mergeRefs([ref, dragPreview]) : mergeRefs([ref, drag])}
    >
      <Dropzone
        handleDrop={handleDrop}
        acceptType='todo'
        parentItem={props.category}
        parentCoordinates={categoryCoordinates}
      >
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
