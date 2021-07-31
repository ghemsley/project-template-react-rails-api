import React, { useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../actions/index'
import { Category, Hover, Dropzone } from './index'

const Project = props => {
  const categories = useSelector(state =>
    state.categories.filter(category => category.projectID === props.project.id)
  )
  const dispatch = useDispatch()
  const coordinatesRef = useRef(null)
  const style = useMemo(() => ({}), [])
  const handleClick = () => {
    dispatch(actions.deeplyDeleteProject(props.project))
  }
  const handleDrop = (item, cursor, coordinates) => {
    if (item.projectID !== props.project.id) {
      dispatch(
        actions.updateCategory({
          ...item,
          projectID: props.project.id
        })
      )
    }
  }

  return (
    <div
      id={props.project.id}
      className='hoverable flex-child radius-4 project'
      style={{
        background: '#10a090',
        color: 'whitesmoke',
        ...style
      }}
    >
      <div ref={coordinatesRef}>
        <Dropzone handleDrop={handleDrop} acceptType='CATEGORY'>
          <h2>{props.project.name}</h2>
          <p>{props.project.description}</p>
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
              <div className='flex parent'>
                {categories.map(category => (
                  <Category
                    category={category}
                    showTodos={true}
                    showDelete={props.showDelete}
                    draggable={true}
                    items={props.items}
                    key={category.id}
                  />
                ))}
              </div>
            </div>
          )}
        </Dropzone>
        {props.hoverable && categories.length > 0 && (
          <Hover>
            {categories.map((category, i) => (
              <div key={i}>
                <Category category={category} />
              </div>
            ))}
          </Hover>
        )}
      </div>
    </div>
  )
}

export default Project
