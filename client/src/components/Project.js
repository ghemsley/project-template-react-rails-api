import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../actions/index'
import { Category, Dropzone, ConfirmScreen } from './index'

const Project = props => {
  const categories = useSelector(state =>
    state.categories.filter(category => category.projectID === props.project.id)
  )
  const dispatch = useDispatch()
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)

  const style = useMemo(() => ({}), [])
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
  const handleClick = () => {
    setShowConfirmScreen(true)
  }
  const closeAction = () => {
    setShowConfirmScreen(false)
  }
  const confirmRemove = () => {
    dispatch(actions.removeProject(props.project))
  }

  return (
    <div
      id={props.project.id}
      className='hoverable flex-child flex rounded project'
      style={{
        background: '#10a090',
        color: 'whitesmoke',
        ...style
      }}
    >
      <Dropzone handleDrop={handleDrop} acceptType='CATEGORY'>
        <h2>{props.project.name}</h2>
        <p>{props.project.description}</p>
        {props.showDelete && (
          <>
            <button
              className='pure-button pure-button-primary animate-height'
              onClick={handleClick}
            >
              Delete
            </button>
            {showConfirmScreen && (
              <ConfirmScreen closeAction={closeAction}>
                <h1>Confirm delete?</h1>
                <button
                  className='pure-button pure-button-primary'
                  onClick={confirmRemove}
                >
                  Delete
                </button>
              </ConfirmScreen>
            )}
          </>
        )}
        {props.showCategories && (
          <>
            <h3>Categories</h3>
            {categories.length < 1 && (
              <p style={{ fontSize: '14px' }}>Drop categories here!</p>
            )}
            <div className='flex category-container'>
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
          </>
        )}
      </Dropzone>
    </div>
  )
}

export default Project
