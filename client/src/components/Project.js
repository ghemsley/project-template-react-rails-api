import { debounce } from 'lodash'
import React, {
  useCallback,
  useEffect,
  useMemo, useRef,
  useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import useResizeObserver from 'use-resize-observer'
import actions from '../actions/index'
import {
  makeSelectCategoriesByProjectID,
  makeSelectUserProjectByCurrentUserAndProjectId
} from '../selectors'
import { Category, ConfirmScreen, Dropzone } from './index'

const Project = React.memo(props => {
  console.log('render project')
  const selectCategoriesByProjectID = useCallback(
    makeSelectCategoriesByProjectID,
    [props.project.id]
  )
  const categories = useSelector(state =>
    selectCategoriesByProjectID(state, props.project.id)
  )
  const selectUserProject = useCallback(
    makeSelectUserProjectByCurrentUserAndProjectId,
    [props.project.id]
  )
  const userProject = useSelector(state =>
    selectUserProject(state, props.project.id)
  )
  const userProjects = useSelector(state => state.userProjects)
  const currentUser = useSelector(state => state.authentication.currentUser)
  const [showJoinLeaveConfirmScreen, setShowJoinLeaveConfirmScreen] =
    useState(false)
  const [showDeleteConfirmScreen, setShowDeleteConfirmScreen] = useState(false)
  const [leaveError, setLeaveError] = useState(null)
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const ref = useRef(null)

  const getCoordinates = useCallback(() => {
    if (ref.current && !props.disablePosition) {
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
  }, [props.project, props.disablePosition, dispatch])

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

  useResizeObserver({ ref, onResize })

  useEffect(() => {
    if (!props.disablePosition) {
      getCoordinates()
      document.addEventListener('scroll', onScroll)
      return () => {
        document.removeEventListener('scroll', onScroll)
      }
    }
  }, [props.disablePosition, getCoordinates, onScroll])

  const handleJoinLeaveClickPositionDisabled = () => {
    if (!currentUser.id) {
      history.push({ pathname: '/signup', state: { background: location } })
    } else if (currentUser.id && !userProject) {
      if (
        !userProjects.find(
          userProj =>
            userProj.userID === currentUser.id &&
            userProj.projectID === props.project.id
        )
      ) {
        dispatch(
          actions.addUserProject({
            user_id: currentUser.id,
            project_id: props.project.id
          })
        ).then(() => history.push('/projects'))
      }
    } else if (currentUser.id && userProject) {
      setShowJoinLeaveConfirmScreen(true)
    }
  }
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
    if (
      !userProjects.find(
        userProj =>
          userProj.userID === currentUser.id &&
          userProj.projectID === props.project.id
      )
    ) {
      dispatch(
        actions.addUserProject({
          user_id: currentUser.id,
          project_id: props.project.id
        })
      )
    }
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
    <>
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
          <div className='button-container'>
            {props.showButtons && props.disablePosition && (
              <button
                className={`pure-button pure-button-primary invisible`}
                onClick={handleJoinLeaveClickPositionDisabled}>
                {userProject ? 'Leave' : 'Join'}
              </button>
            )}
            {props.showButtons && !props.disablePosition && currentUser.id && (
              <button
                className={`pure-button pure-button-primary invisible`}
                onClick={handleLeaveJoinClick}>
                {userProject ? 'Leave' : 'Join'}
              </button>
            )}
            {props.showButtons && !props.disablePosition && userProject && (
              <>
                <Link
                  className={`pure-button pure-button-primary invisible`}
                  to={{
                    pathname: `/projects/${props.project.id}/edit`,
                    state: { background: location, edit: props.project }
                  }}>
                  Edit
                </Link>
                <button
                  className={`pure-button pure-button-delete invisible`}
                  onClick={handleDeleteClick}>
                  Delete
                </button>
              </>
            )}
          </div>
          {props.showCategories && (
            <>
              {!props.disablePosition && <h3>Categories</h3>}
              {categories.length < 1 && !props.disablePosition && (
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
      {showJoinLeaveConfirmScreen && (
        <div className='fixed'>
          <ConfirmScreen closeAction={closeJoinLeaveAction}>
            <h1>Confirm {userProject ? 'leave' : 'join'}?</h1>
            {leaveError && <p>{leaveError}</p>}
            <button
              className='pure-button pure-button-delete'
              onClick={userProject ? confirmLeave : confirmJoin}>
              {userProject ? 'Leave' : 'Join'}
            </button>
          </ConfirmScreen>
        </div>
      )}
      {showDeleteConfirmScreen && (
        <div className='fixed'>
          <ConfirmScreen closeAction={closeDeleteAction}>
            <h1>Confirm delete?</h1>
            <button
              className='pure-button pure-button-delete'
              onClick={confirmRemove}>
              Delete
            </button>
          </ConfirmScreen>
        </div>
      )}
    </>
  )
})

export default Project
