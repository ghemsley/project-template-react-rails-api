import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDrag } from 'react-dnd'
import actions from '../actions/index'
import { ConfirmScreen } from './index'
import { Link, useLocation } from 'react-router-dom'
import mergeRefs from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'
import { debounce } from 'lodash'

const Todo = props => {
  const category = useSelector(state =>
    state.categories.find(category => category.id === props.todo.categoryID)
  )
  const todoCoordinates = useSelector(state =>
    state.coordinates.find(
      coords => coords.type === 'todo' && coords.item.id === props.todo.id
    )
  )
  // const [lastDragPos, setLastDragPos] = useState(null)
  // const [lastDragCursorPos, setLastDragCursorPos] = useState(null)
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)
  const [order, setOrder] = useState(0)
  const dispatch = useDispatch()
  const location = useLocation()
  const ref = useRef(null)

  const getCoordinates = useCallback(
    size => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const coordinates = {
          type: 'todo',
          item: props.todo,
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
    [props.todo, dispatch]
  )

  const onResize = debounce(size => getCoordinates(size), 100, {
    maxWait: 250,
    trailing: true
  })
  const onScroll = debounce(size => getCoordinates(size), 250, {
    maxWait: 500,
    trailing: true
  })

  const observer = useResizeObserver({ ref, onResize })

  useEffect(() => {
    document.addEventListener('scroll', () =>
      onScroll({ width: observer.width, height: observer.height })
    )
    return () => {
      document.removeEventListener('scroll', () =>
        onScroll({ width: observer.width, height: observer.height })
      )
    }
  }, [])

  const [{ dragging, cursor, element }, drag, dragPreview] = useDrag(
    () => ({
      type: 'todo',
      item: monitor => props.todo,
      previewOptions: { captureDraggingState: true },
      options: { dropEffect: 'copy' },
      collect: monitor => ({
        dragging: monitor.isDragging(),
        cursor: monitor.getClientOffset(),
        element: monitor.getSourceClientOffset()
      }),
      end: (item, monitor) => {
        if (monitor.didDrop()) {
          console.log('result', monitor.getDropResult())
        }
      }
    }),
    []
  )

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
      id={`todo-${props.todo.id}`}
      className='hoverable flex-child rounded todo'
      style={{
        color: 'whitesmoke',
        transition: 'background-color 150ms ease',
        ...style
      }}
      ref={dragging ? mergeRefs([ref, dragPreview]) : mergeRefs([ref, drag])}
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
              className={`pure-button pure-button-primary invisible`}
              to={{
                pathname: `todos/${props.todo.id}/edit`,
                state: { background: location, edit: props.todo }
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
    </div>
  )
}

export default Todo
