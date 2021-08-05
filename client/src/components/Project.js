import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import useResizeObserver from 'use-resize-observer'
import actions from '../actions/index'
import { Category, Dropzone, ConfirmScreen } from './index'
import { debounce } from 'lodash'

const Project = props => {
  const categories = useSelector(state =>
    state.categories.filter(category => category.projectID === props.project.id)
  )
  const coordinates = useSelector(state => state.coordinates)
  const [showConfirmScreen, setShowConfirmScreen] = useState(false)
  const projectCoordinates = useSelector(state =>
    state.coordinates.find(
      coords => coords.type === 'project' && coords.item.id === props.project.id
    )
  )
  const location = useLocation()
  const dispatch = useDispatch()
  const ref = useRef(null)

  const getCoordinates = useCallback(
    size => {
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
            width: size.width,
            height: size.height,
            rectWidth: rect.width,
            rectHeight: rect.height
          }
        }
        dispatch(actions.refreshCoordinates(coordinates))
      }
    },
    [props.project, dispatch]
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

  const style = useMemo(() => ({}), [])
  const handleDrop = (item, result) => {
    const categoryCoordsArray = coordinates.filter(
      coords =>
        coords.type === 'category' && coords.item.projectID === props.project.id
    )
    for (const coords of categoryCoordsArray) {
      if (coords.item.id !== item.id) {
        if (result.cursor.y > coords.position.top) {
          console.log('cursor is below', {
            element: coords.position.top,
            cursor: result.cursor.y
          })
        } else {
          console.log('cursor is above', {
            element: coords.position.top,
            cursor: result.cursor.y
          })
        }
      }
    }
    const category = { ...item, projectID: props.project.id }
    if (item.projectID !== props.project.id) {
      dispatch(actions.amendCategory(category))
    }
    // categoryCoordsArray.sort((coord1, coord2) => {
    //   if (coord1.order > coord2.order) {
    //     return 1
    //   } else if (coord1.order < coord2.order) {
    //     return -1
    //   } else return 0
    // })
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
      id={`project-${props.project.id}`}
      className='hoverable flex-child flex rounded project'
      style={{
        background: '#10a090',
        color: 'whitesmoke',
        ...style
      }}
      ref={ref}
    >
      <Dropzone
        handleDrop={handleDrop}
        acceptType='category'
        parentCoordinates={projectCoordinates}
      >
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
                }}
              >
                Edit
              </Link>
              <button
                className={`pure-button pure-button-delete invisible`}
                onClick={handleClick}
              >
                Delete
              </button>
            </div>
            {showConfirmScreen && (
              <ConfirmScreen closeAction={closeAction}>
                <h1>Confirm delete?</h1>
                <button
                  className='pure-button pure-button-delete'
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
                  showButtons={props.showButtons}
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
