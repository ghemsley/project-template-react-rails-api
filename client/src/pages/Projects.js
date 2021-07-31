import React from 'react'
import { useSelector } from 'react-redux'
import ProjectForm from '../components/ProjectForm'
import Project from '../components/Project'

const Projects = () => {
  const projects = useSelector(state => state.projects)

  return (
    <div className='center center-text project-page'>
      <div>
        <p>Create Project</p>
        <ProjectForm />
        <p>Projects</p>
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
