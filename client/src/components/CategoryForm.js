import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../actions/index'
import Hover from './Hover'
import Project from './Project'

const CategoryForm = () => {
  const projects = useSelector(state => state.projects)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [projectID, setProjectID] = useState(projects[0] ? projects[0].id : '')
  const dispatch = useDispatch()

  const handleSubmit = event => {
    event.preventDefault()
    dispatch(
      actions.createCategory({
        name: name,
        description: description,
        projectID: projectID
      })
    )
    setName('')
    setDescription('')
  }
  const handleChange = event => {
    switch (event.target.name) {
      case 'name':
        setName(event.target.value)
        break
      case 'description':
        setDescription(event.target.value)
        break

      case 'projectID':
        setProjectID(event.target.value)
        break

      default:
        break
    }
  }

  return (
    <>
      {projects.length < 1 ? (
        <p>Please create a project first before trying to create a category!</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className='pure-form pure-form-stacked center fit'
        >
          <fieldset>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              name='name'
              value={name}
              onChange={handleChange}
            />
            <label htmlFor='description'>Description</label>
            <input
              type='text'
              name='description'
              value={description}
              onChange={handleChange}
            />
            <label htmlFor='projectID' className='hoverable'>
              Project
              <select
                name='projectID'
                value={projectID}
                onChange={handleChange}
              >
                {projects.map((project, i) => (
                  <option value={project.id} key={i}>
                    {project.name}
                  </option>
                ))}
              </select>
              {projects.length > 0 && (
                <Hover>
                  <Project
                    project={projects.find(project => project.id === projectID)}
                    showCategories={true}
                  />
                </Hover>
              )}
            </label>
            <button className='pure-button pure-button-primary' type='submit'>
              Submit
            </button>
          </fieldset>
        </form>
      )}
    </>
  )
}
export default CategoryForm
