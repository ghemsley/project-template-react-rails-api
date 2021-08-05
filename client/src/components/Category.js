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
    todoCoordsArray.sort(
      (todoCoords1, todoCoords2) =>
        todoCoords1.item.order - todoCoords2.item.order
    )
    for (let i = 1; i < todoCoordsArray.length; i++) {
      todoCoordsArray[i].order = i
    }
    let order = 0
    let i = 0
    while (i < todoCoordsArray.length) {
      if (todoCoordsArray[i].item.id !== item.id) {
        if (result.element.y < todoCoordsArray[i].position.top) {
          console.log('element is below droppedElement', {
            element: todoCoordsArray[i].position.top,
            droppedElement: result.element.y
          })
          order = i
          for (let j = i; j < todoCoordsArray.length; j++) {
            if (todoCoordsArray[j].item.id !== item.id) {
              todoCoordsArray[j].item.order += 1
              console.log(`id ${todoCoordsArray[j].item.id} order + 1`)
            }
          }
          if (i === 0) {
            break
          }
          for (let j = i - 1; j >= 0; j--) {
            if (todoCoordsArray[j].item.id !== item.id) {
              todoCoordsArray[j].item.order -= 1
              console.log(`id ${todoCoordsArray[j].item.id} order -1`)
            }
          }
          break
        } else {
          console.log('element is above droppedElement', {
            element: todoCoordsArray[i].position.top,
            droppedElement: result.element.y
          })
          order = i + 1
        }
      }
      i++
    }
    const todosToUpdate = todoCoordsArray.map(coords => coords.item)
    const existingTodo = todosToUpdate.find(existing => existing.id === item.id)
    if (!existingTodo) {
      const todo = { ...item, order: order, categoryID: props.category.id }
      todosToUpdate.push(todo)
    } else {
      todosToUpdate[todosToUpdate.indexOf(existingTodo)].order = order
    }
    todosToUpdate.sort((todo1, todo2) => todo1.order - todo2.order)
    console.log('todos to update', todosToUpdate)
    for (let i = 0; i < todosToUpdate.length; i++) {
      todosToUpdate[i].order = i
    }
    // dispatch(actions.batchAmendTodos(todosToUpdate))
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

  const compareOrder = (todo1, todo2) => todo1.order - todo2.order

  return (
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
        handleDrop={handleDrop}
        acceptType='todo'
        parentItem={props.category}
        parentCoordinates={categoryCoordinates}>
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
                }}>
                Edit
              </Link>
              <button
                className={`pure-button pure-button-delete invisible`}
                onClick={handleClick}>
                Delete
              </button>
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
                  {todos.sort(compareOrder).map(todo => (
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
