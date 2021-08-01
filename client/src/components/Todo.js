import React, { useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDrag } from 'react-dnd'
import actions from '../actions/index'
import { Hover, Project } from './index'

const Todo = props => {
  const dispatch = useDispatch()
  const categories = useSelector(state => state.categories)
  const projects = useSelector(state => state.projects)
  const category = categories.find(
    category => category.id === props.todo.categoryID
  )
  const project = projects.find(project => project.id === category.projectID)
  const coordinatesRef = useRef(null)

  const handleButtonPointerDown = () => {
    dispatch(actions.deleteTodo({ id: props.todo.id }))
  }

  const [{ dragging, coordinates }, drag, dragPreview] = useDrag(() => ({
    type: 'TODO',
    item: props.todo,
    previewOptions: { captureDraggingState: true },
    collect: monitor => ({
      dragging: monitor.isDragging(),
      coordinates: monitor.getSourceClientOffset()
    })
  }))

  const style = useMemo(
    () => ({ background: dragging ? '#10a0f0' : '#1090d0' }),
    [dragging]
  )

  return (
    <div
      id={props.todo.id}
      className='hoverable flex-child rounded todo'
      style={{
        color: 'whitesmoke',
        transition: 'background-color 50ms ease',
        ...style
      }}
      ref={drag}
    >
      <div ref={coordinatesRef}>
        <h2>{props.todo.name}</h2>
        <p>{props.todo.description}</p>
        {props.showDelete && (
          <button
            className='pure-button pure-button-primary'
            onClick={handleButtonPointerDown}
          >
            Delete
          </button>
        )}
        {props.hoverable && !dragging && (
          <Hover>
            <Project project={project} showCategories={true} />
          </Hover>
        )}
      </div>
    </div>
  )
}

export default Todo
