import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../actions/index'
import { Hover, Project, Modal } from './index'

const CategoryForm = () => {
  const projects = useSelector(state => state.projects)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [projectID, setProjectID] = useState(projects[0] ? projects[0].id : '')
  const project = projects.find(project => project.id === projectID)
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
    <Modal>
      {projects.length < 1 ? (
        <p className='fit margin-auto'>
          Please create a project first before trying to create a category!
        </p>
      ) : (
        <>
          <h1 className='fit margin-auto'>New Category</h1>
          <form
            onSubmit={handleSubmit}
            className='pure-form pure-form-stacked fit margin-auto'
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
                {projects.length > 0 && (
                  <Hover>
                    <Project project={project} showCategories={true} />
                  </Hover>
                )}
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
              </label>
              <button className='pure-button pure-button-primary' type='submit'>
                Submit
              </button>
            </fieldset>
          </form>
        </>
      )}
    </Modal>
  )
}
export default CategoryForm
