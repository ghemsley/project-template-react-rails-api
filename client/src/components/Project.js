import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import useResizeObserver from 'use-resize-observer'
import actions from '../actions/index'
import { Category, Dropzone, ConfirmScreen } from './index'
import { debounce } from 'lodash'
import {
  makeSelectCategoriesByProjectID,
  makeSelectUserProject
} from '../selectors'

const Project = React.memo(props => {
  console.log('render project')
  const selectCategoriesByProjectID = useCallback(
    makeSelectCategoriesByProjectID,
    [props]
  )
  const categories = useSelector(state =>
    selectCategoriesByProjectID(state, props)
  )
  const selectUserProject = useCallback(makeSelectUserProject, [props])
  const userProject = useSelector(state => selectUserProject(state, props))
  const currentUser = useSelector(state => state.authentication.currentUser)
  const [showJoinLeaveConfirmScreen, setShowJoinLeaveConfirmScreen] =
    useState(false)
  const [showDeleteConfirmScreen, setShowDeleteConfirmScreen] = useState(false)
  const [leaveError, setLeaveError] = useState(null)
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

  const handleLeaveJoinClick = () => {
    setShowJoinLeaveConfirmScreen(true)
  }
  const closeJoinLeaveAction = () => {
    setShowJoinLeaveConfirmScreen(false)
  }
  const handleDeleteClick = () => {
    setShowDeleteConfirmScreen(true)
  }
  const closeDeleteAction = () => {
    setShowDeleteConfirmScreen(false)
  }
  const confirmJoin = () => {
    dispatch(
      actions.instantiateUserProject({
        user_id: currentUser.id,
        project_id: props.project.id
      })
    )
  }
  const confirmLeave = () => {
    setLeaveError(null)
    dispatch(actions.removeUserProject(userProject)).catch(error =>
      setLeaveError(error)
    )
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
              <button
                className={`pure-button pure-button-primary invisible`}
                onClick={handleLeaveJoinClick}>
                {userProject ? 'Leave' : 'Join'}
              </button>
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
                onClick={handleDeleteClick}>
                Delete
              </button>
            </div>
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
      {showJoinLeaveConfirmScreen && (
        <ConfirmScreen closeAction={closeJoinLeaveAction}>
          <h1>Confirm {userProject ? 'leave' : 'join'}?</h1>
          {leaveError && <p>{leaveError}</p>}
          <button
            className='pure-button pure-button-delete'
            onClick={userProject ? confirmLeave : confirmJoin}>
            {userProject ? 'Leave' : 'Join'}
          </button>
        </ConfirmScreen>
      )}
      {showDeleteConfirmScreen && (
        <ConfirmScreen closeAction={closeDeleteAction}>
          <h1>Confirm delete?</h1>
          <button
            className='pure-button pure-button-delete'
            onClick={confirmRemove}>
            Delete
          </button>
        </ConfirmScreen>
      )}
    </div>
  )
})

export default Project
