import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Project from '../components/Project'
import { Link, useLocation } from 'react-router-dom'
import actions from '../actions/index'

const Projects = () => {
  const projects = useSelector(state => state.projects)
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.instantiateEverything())
  }, [dispatch])

  return (
    <div className='center center-text project-page'>
      <div>
        <Link
          className='pure-button pure-button-primary'
          to={{ pathname: 'projects/new', state: { background: location } }}
        >
          Create Project
        </Link>
        {projects.length > 0 && <h1>Projects</h1>}
      </div>
      <div className='flex project-container'>
        {projects.map(project => (
          <Project
            project={project}
            showDelete={true}
            showCategories={true}
            key={project.id}
          />
        ))}
      </div>
    </div>
  )
}

export default Projects
