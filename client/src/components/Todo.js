import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMultiDrag } from 'react-dnd-multi-backend'
import actions from '../actions/index'
import { ConfirmScreen } from './index'
import { Link, useLocation } from 'react-router-dom'
import mergeRefs from 'react-merge-refs'
import useResizeObserver from 'use-resize-observer'
import { debounce } from 'lodash'
import selectors from '../selectors'
import { motion } from 'framer-motion'
import helpers from '../helpers'

const Todo = React.memo(props => {
  // console.log('render todo')
  const selectCategoryByTodoCategoryID = selectors.makeSelectCategoryById
  const category = useSelector(state =>
    selectCategoryByTodoCategoryID(state, props.todo.categoryID)
  )
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const ref = useRef(null)

  const [
    [{ dragging }],
    {
      html5: [html5Props, html5Drag, html5DragPreview],
      touch: [touchProps, touchDrag, touchDragPreview],
    },
  ] = useMultiDrag(
    () => ({
      item: { type: 'todo' },
      begin: () => props.todo,
      previewOptions: { captureDraggingState: true },
      options: { dropEffect: 'copy' },
      collect: monitor => ({
        dragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        // if (monitor.didDrop()) {
        //   console.log('result', monitor.getDropResult())
        // }
      },
    }),
    [props.todo]
  )

  const getCoordinates = useCallback(() => {
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
          rectWidth: rect.width,
          rectHeight: rect.height,
        },
      }
      dispatch(actions.refreshCoordinates(coordinates))
    }
  }, [props.todo, dispatch])

  const onResize = useMemo(
    () =>
      debounce(getCoordinates, 100, {
        maxWait: 200,
        trailing: true,
      }),
    [getCoordinates]
  )

  const onScroll = useMemo(
    () =>
      debounce(getCoordinates, 250, {
        maxWait: 500,
        trailing: true,
      }),
    [getCoordinates]
  )

  useResizeObserver({ ref, onResize })

  useEffect(() => {
    getCoordinates()
    document.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [getCoordinates, onScroll])

  const style = useMemo(() => ({ background: dragging ? '#099DB8' : '#099DB8' }), [dragging])

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
    <motion.div
      key={`todo-${props.todo.id}`}
      initial="initial"
      animate="in"
      exit="out"
      variants={helpers.variants}
      id={`todo-${props.todo.id}`}
      className="hoverable flex-child rounded todo"
      style={{
        color: 'whitesmoke',
        transition: 'background-color 150ms ease',
        ...style,
      }}
      ref={
        dragging
          ? mergeRefs([ref, html5DragPreview, touchDragPreview])
          : mergeRefs([ref, html5Drag, touchDrag])
      }
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
          <div className="button-container">
            <Link
              className={`pure-button pure-button-primary invisible`}
              to={{
                pathname: `/todos/${props.todo.id}/edit`,
                state: { background: location, edit: props.todo },
              }}
            >
              Edit
            </Link>
            <button className={`pure-button pure-button-delete invisible`} onClick={handleClick}>
              Delete
            </button>
          </div>
          {showConfirmScreen && (
            <ConfirmScreen closeAction={closeAction}>
              <h1>Confirm delete?</h1>
              <button className="pure-button pure-button-delete" onClick={confirmRemove}>
                Delete
              </button>
            </ConfirmScreen>
          )}
        </>
      )}
    </motion.div>
  )
})

export default Todo
