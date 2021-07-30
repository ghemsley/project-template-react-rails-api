import React, { useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../actions/index'
import { Category, Hover } from './index'

const Project = props => {
  const categories = useSelector(state =>
    state.categories.filter(category => category.projectID === props.project.id)
  )
  const dispatch = useDispatch()
  const projectRef = useRef(null)

  useLayoutEffect(() => {
    if (projectRef.current) {
      const rect = projectRef.current.getBoundingClientRect()
      const coordinates = {
        id: props.project.id,
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
  }, [props.project.id, dispatch])

  const handleClick = () => {
    dispatch(actions.deeplyDeleteProject(props.project))
  }

  return (
    <div
      id={props.project.id}
      className='hoverable flex-child radius-6 project'
      style={{
        background: '#11aa99',
        color: 'whitesmoke'
      }}
      ref={projectRef}
    >
      <h2>{props.project.name}</h2>
      <p>{props.project.description}</p>
      {props.hoverable && categories.length > 0 && (
        <Hover>
          {categories.map((category, i) => (
            <div key={i}>
              <Category category={category} />
              {categories[i + 1] && <hr />}
            </div>
          ))}
        </Hover>
      )}
      {props.showDelete && (
        <button
          className='pure-button pure-button-primary animate-height'
          onClick={handleClick}
        >
          Delete
        </button>
      )}
      {props.showCategories && (
        <div>
          <h3>Categories</h3>
          {categories.length < 1 && (
            <p style={{ fontSize: '14px' }}>Place categories here!</p>
          )}
          <div className='flex'>
            {categories.map((category, i) => (
              <Category
                category={category}
                showTodos={true}
                showDelete={props.showDelete}
                draggable={true}
                parentRef={projectRef}
                key={i}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Project
