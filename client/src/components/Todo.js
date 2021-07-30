import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../actions/index'
import { Hover } from './index'
import { Project } from './index'

const Todo = props => {
  const dispatch = useDispatch()
  const categories = useSelector(state => state.categories)
  const projects = useSelector(state => state.projects)
  const category = categories.find(
    category => category.id === props.todo.categoryID
  )
  const [dragging, setDragging] = useState(false)
  const [left, setLeft] = useState(window.innerWidth)
  const [top, setTop] = useState(window.innerHeight)
  const [leftOffset, setLeftOffset] = useState(0)
  const [topOffset, setTopOffset] = useState(0)
  const todoRef = useRef(null)

  const handlePointerUp = useCallback(
    event => {
      setLeft(event.clientX)
      setTop(event.clientY)
      if (props.draggable) {
        for (const category of categories) {
          const element = document.getElementById(category.id)
          if (element) {
            const rect = element.getBoundingClientRect()
            const coordinates = {
              id: category.id,
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              height: rect.height,
              width: rect.width
            }
            dispatch(actions.updateCategoryCoordinates({ coordinates }))
          }
        }
        dispatch(
          actions.updateTodoAssociation({
            todo: props.todo,
            left,
            top
          })
        )
        setDragging(false)
      }
    },
    [props.todo, props.draggable, categories, left, top, dispatch]
  )

  const handlePointerMove = useCallback(event => {
    setLeft(event.clientX)
    setTop(event.clientY)
  }, [])

  const handlePointerDown = event => {
    event.stopPropagation()
    if (props.draggable) {
      setDragging(true)
      setLeft(event.clientX)
      setTop(event.clientY)
    }
  }
  const handleButtonPointerDown = () => {
    dispatch(actions.deleteTodo({ id: props.todo.id }))
  }

  useLayoutEffect(() => {
    if (props.draggable && dragging && todoRef.current) {
      setLeftOffset(todoRef.current.clientWidth / 2)
      setTopOffset(todoRef.current.clientHeight / 2)
    }
    if (props.draggable && dragging) {
      document.addEventListener('pointerup', handlePointerUp, {
        passive: true
      })
      document.addEventListener('pointermove', handlePointerMove, {
        passive: true
      })
    }
    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [props.draggable, dragging, handlePointerUp, handlePointerMove])
  
  return (
    <div
      id={props.todo.id}
      className='hoverable flex-child radius-6 todo'
      style={{
        background: '#2090d0',
        color: 'whitesmoke',
        position: dragging ? 'fixed' : 'unset',
        left: dragging ? left - leftOffset : 'unset',
        top: dragging ? top - topOffset : 'unset'
      }}
      onPointerDown={handlePointerDown}
      ref={todoRef}
    >
      <h2>{props.todo.name}</h2>
      <p>{props.todo.description}</p>
      {props.showDelete && !dragging && (
        <button
          className='pure-button pure-button-primary'
          onPointerDown={handleButtonPointerDown}
        >
          Delete
        </button>
      )}
      {props.hoverable && !dragging && (
        <Hover>
          <Project
            project={projects.find(
              project => project.id === category.projectID
            )}
            showCategories={true}
          />
        </Hover>
      )}
    </div>
  )
}

export default Todo
