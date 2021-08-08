import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Project from '../components/Project'
import { Link, useLocation } from 'react-router-dom'
import actions from '../actions'

const Projects = () => {
  const projects = useSelector(state => state.projects)
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (projects.length < 1) {
      dispatch(actions.instantiateEverythingForUser())
    }
  }, [])

  return (
    <div className='center center-text project-page'>
      <div className='button-container'>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: 'projects/new', state: { background: location } }}>
          Create Project
        </Link>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: 'categories/new', state: { background: location } }}>
          Create Category
        </Link>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: 'todos/new', state: { background: location } }}>
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
