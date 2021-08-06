import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import useResizeObserver from 'use-resize-observer'
import actions from '../actions/index'
import { Category, Dropzone, ConfirmScreen } from './index'
import { debounce } from 'lodash'
import { makeSelectCategoriesByProjectID } from '../selectors'

const Project = React.memo(props => {
  console.log('render project')
  const selectCategoriesByProjectID = useCallback(
    makeSelectCategoriesByProjectID,
    [props]
  )
  const categories = useSelector(state =>
    selectCategoriesByProjectID(state, props)
  )
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const ref = useRef(null)

  const getCoordinates = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const coordinates = {
        type: 'project',
        item: props.project,
        position: {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          rectWidth: rect.width,
          rectHeight: rect.height
        }
      }
      dispatch(actions.refreshCoordinates(coordinates))
    }
  }, [props.project, dispatch])

  const onResize = useMemo(
    () =>
      debounce(getCoordinates, 300, {
        trailing: true,
        maxWait: 600
      }),
    [getCoordinates]
  )

  const onScroll = useMemo(
    () =>
      debounce(getCoordinates, 250, {
        trailing: true,
        maxWait: 500
      }),
    [getCoordinates]
  )

  const observer = useResizeObserver({ ref, onResize })

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
    dispatch(actions.removeProject(props.project))
  }

  return (
    <div
      id={`project-${props.project.id}`}
      className='hoverable flex-child flex rounded project'
      style={{
        background: '#10a090',
        color: 'whitesmoke'
      }}
      ref={ref}>
      <Dropzone
        parentID={props.project.id}
        acceptType='category'
        parentType='project'>
        <h2>{props.project.name}</h2>
        <p>{props.project.description}</p>
        {props.showButtons && (
          <>
            <div className='button-container'>
              <Link
                className={`pure-button pure-button-primary invisible`}
                to={{
                  pathname: `projects/${props.project.id}/edit`,
                  state: { background: location, edit: props.project }
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
                  showButtons={props.showButtons}
                  key={`category-${category.id}`}
                />
              ))}
            </div>
          </>
        )}
      </Dropzone>
    </div>
  )
})

export default Project
