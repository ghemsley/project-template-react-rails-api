import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../actions/index'
import { Todo, Hover, Project } from './index'

const Category = props => {
  const todos = useSelector(state =>
    state.todos.filter(todo => todo.categoryID === props.category.id)
  )
  const projects = useSelector(state => state.projects)
  const dispatch = useDispatch()
  const [dragging, setDragging] = useState(false)
  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)
  const [leftOffset, setLeftOffset] = useState(0)
  const [topOffset, setTopOffset] = useState(0)
  const categoryRef = useRef(null)

  const handlePointerDown = event => {
    event.stopPropagation()
    if (props.draggable) {
      setDragging(true)
      setLeft(event.clientX)
      setTop(event.clientY)
    }
  }

  const handleButtonPointerDown = event => {
    event.stopPropagation()
    dispatch(actions.deeplyDeleteCategory({ id: props.category.id }))
  }

  const handlePointerMove = useCallback(
    event => {
      setLeft(event.clientX)
      setTop(event.clientY)
    },
    []
  )

  const handlePointerUp = useCallback(
    event => {
      setLeft(event.clientX)
      setTop(event.clientY)
      if (props.draggable) {
        for (const project of projects) {
          const element = document.getElementById(project.id)
          if (element) {
            const rect = element.getBoundingClientRect()
            const coordinates = {
              id: project.id,
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              height: rect.height,
              width: rect.width
            }
            dispatch(
              actions.updateProjectCoordinates({
                coordinates
              })
            )
          }
        }
        dispatch(
          actions.updateCategoryAssociation({
            category: props.category,
            left,
            top
          })
        )
        setDragging(false)
      }
    },
    [props.category, props.draggable, projects, left, top, dispatch]
  )

  useLayoutEffect(() => {
    if (categoryRef.current) {
      const rect = categoryRef.current.getBoundingClientRect()
      const coordinates = {
        id: props.category.id,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        width: rect.width
      }
      dispatch(
        actions.updateCategoryCoordinates({
          coordinates
        })
      )
    }
    if (props.draggable) {
      if (categoryRef.current && dragging) {
        setLeftOffset(categoryRef.current.clientWidth / 2)
        setTopOffset(categoryRef.current.clientHeight / 2)
      }
      if (dragging) {
        document.addEventListener('pointermove', handlePointerMove, {
          passive: true
        })
        document.addEventListener('pointerup', handlePointerUp, {
          passive: true
        })
      }
      return () => {
        document.removeEventListener('pointerup', handlePointerUp)
        document.removeEventListener('pointermove', handlePointerMove)
      }
    }
  }, [
    props.category.id,
    props.draggable,
    dragging,
    handlePointerUp,
    handlePointerMove,
    dispatch
  ])

  return (
    <div
      id={props.category.id}
      className='hoverable flex-child radius-6 category'
      style={{
        background: '#1166aa',
        color: 'whitesmoke',
        position: dragging ? 'fixed' : 'unset',
        left: dragging ? left - leftOffset : 'unset',
        top: dragging ? top - topOffset : 'unset'
      }}
      onPointerDown={handlePointerDown}
      ref={categoryRef}
    >
      <h2>{props.category.name}</h2>
      <p>{props.category.description}</p>
      {props.showDelete && !dragging && (
        <button
          className='pure-button pure-button-primary animate-height'
          onPointerDown={handleButtonPointerDown}
        >
          Delete
        </button>
      )}
      {props.showTodos && (
        <div>
          <h3>Todos</h3>
          {todos.length < 1 && (
            <p style={{ fontSize: '14px' }}>Place todos here!</p>
          )}
          <div className='flex'>
            {todos.map((todo, i) => (
              <Todo
                todo={todo}
                draggable={true}
                showDelete={props.showDelete && !dragging}
                parentRef={categoryRef}
                key={i}
              />
            ))}
          </div>
        </div>
      )}
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
  )
}

export default Category
