import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import actions from '../actions/index'
import { Hover, Project, Modal } from './index'

const CategoryForm = props => {
  const projects = useSelector(state => state.projects)
  const [name, setName] = useState(props.edit ? props.edit.name : '')
  const [description, setDescription] = useState(
    props.edit ? props.edit.description : ''
  )
  const [projectID, setProjectID] = useState(
    props.edit ? props.edit.projectID : projects[0] ? projects[0].id : ''
  )
  const project = projects.find(project => project.id === projectID)
  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = event => {
    event.preventDefault()
    if (!props.edit) {
      dispatch(
        actions.instantiateCategory({
          name: name,
          description: description,
          projectID: projectID
        })
      )
      setName('')
      setDescription('')
    } else {
      dispatch(
        actions.amendCategory({
          ...props.edit,
          name: name,
          description: description,
          projectID: projectID
        })
      )
      history.goBack()
    }
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
          <h1 className='fit margin-auto'>
            {props.edit ? 'Edit' : 'New'} Category
          </h1>
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
                    <Project project={project} showCategories />
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
