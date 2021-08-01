import React from 'react'
import { useSelector } from 'react-redux'
import ProjectForm from '../components/ProjectForm'
import Project from '../components/Project'
import { Link, Route, useLocation } from 'react-router-dom'

const Projects = () => {
  const projects = useSelector(state => state.projects)
  const location = useLocation()

  return (
    <div className='center center-text project-page'>
      <div>
        <Link className='pure-button pure-button-primary'
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
