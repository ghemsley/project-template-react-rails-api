import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import Project from '../components/Project'
import actions from '../actions'
import { makeSelectProjectsByCurrentUserID } from '../selectors'

const Projects = () => {
  const selectUserProjectsByCurrentUserID = useCallback(
    makeSelectProjectsByCurrentUserID,
    []
  )
  const projects = useSelector(state =>
    selectUserProjectsByCurrentUserID(state)
  )
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.instantiateEverythingForUser())
  }, [dispatch])

  return (
    <div className='center center-text project-page'>
      <div className='button-container'>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: '/projects/new', state: { background: location } }}>
          Create Project
        </Link>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: '/categories/new', state: { background: location } }}>
          Create Category
        </Link>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: '/todos/new', state: { background: location } }}>
          Create Todo
        </Link>
      </div>
      {projects.length > 0 && <h1>Projects</h1>}
      <div className='flex project-container'>
        {projects.map(project => (
          <Project
            project={project}
            showButtons={true}
            showCategories={true}
            key={`project-${project.id}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Projects
