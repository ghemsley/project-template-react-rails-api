import { debounce } from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDrag } from 'react-dnd'
import mergeRefs from 'react-merge-refs'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import useResizeObserver from 'use-resize-observer'
import actions from '../actions/index'
import selectors from '../selectors'
import { ConfirmScreen, Dropzone, Todo } from './index'

const Category = React.memo(props => {
  // console.log('render category')
  const selectTodosByCategoryID = selectors.makeSelectTodosByCategoryId
  const todos = useSelector(state =>
    selectTodosByCategoryID(state, props.category.id)
  )
  const selectProjectsByCategoryProjectID = selectors.makeSelectProjectById
  const project = useSelector(state =>
    selectProjectsByCategoryProjectID(state, props.category.projectID)
  )
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const ref = useRef(null)

  const [{ dragging }, drag, dragPreview] = useDrag(
    () => ({
      item: { type: 'category' },
      begin: () => props.category,
      previewOptions: { captureDraggingState: true },
      options: { dropEffect: 'copy' },
      collect: monitor => ({
        dragging: monitor.isDragging()
      })
    }),
    [props.category]
  )

  const getCoordinates = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const newCoordinates = {
        type: 'category',
        item: props.category,
        position: {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          rectWidth: rect.width,
          rectHeight: rect.height
        }
      }
      dispatch(actions.refreshCoordinates(newCoordinates))
    }
  }, [props.category, dispatch])

  const onResize = useMemo(
    () =>
      debounce(getCoordinates, 200, {
        trailing: true,
        maxWait: 400
      }),
    [getCoordinates]
  )

  useResizeObserver({ ref, onResize })

  const onScroll = useMemo(
    () =>
      debounce(getCoordinates, 250, {
        maxWait: 500,
        trailing: true
      }),
    [getCoordinates]
  )
  useEffect(() => {
    getCoordinates()
    document.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [getCoordinates, onScroll])

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
    () => ({ background: dragging ? '#0969AD' : '#0969AD' }),
    [dragging]
  )

  return (
    <>
      <div
        id={`category-${props.category.id}`}
        className='hoverable flex-child rounded category'
        style={{
          color: 'whitesmoke',
          transition: 'background-color 150ms ease',
          ...style
        }}
        ref={dragging ? mergeRefs([ref, dragPreview]) : mergeRefs([ref, drag])}>
        <Dropzone
          parentID={props.category.id}
          acceptType='todo'
          parentType='category'>
          <h2>{props.category.name}</h2>
          <p>{props.category.description}</p>
          {props.showProject && (
            <p>
              <strong>Project:</strong> {project.name}
            </p>
          )}
          {props.showButtons && (
            <div className='button-container'>
              <Link
                className={`pure-button pure-button-primary invisible`}
                to={{
                  pathname: `/categories/${props.category.id}/edit`,
                  state: { background: location, edit: props.category }
                }}>
                Edit
              </Link>
              <button
                className={`pure-button pure-button-delete invisible`}
                onClick={handleClick}>
                Delete
              </button>
            </div>
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
                        key={`todo-${todo.id}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </Dropzone>
      </div>
      {showConfirmScreen && (
        <ConfirmScreen closeAction={closeAction}>
          <h1>Confirm delete?</h1>
          <button
            className='pure-button pure-button-delete'
            onClick={confirmRemove}>
            Delete
          </button>
        </ConfirmScreen>
      )}
    </>
  )
})

export default Category
