import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import actions from '../actions/index'
import { Hover, Project, Modal } from './index'
import selectors from '../selectors'

const CategoryForm = React.memo(props => {
  const selectProjectsByCurrentUserID = selectors.makeSelectProjectsByCurrentUserId
  const selectFirstProjectIdByCurrentUser = selectors.makeSelectFirstProjectIdByCurrentUserId
  const projects = useSelector(state => selectProjectsByCurrentUserID(state))
  const firstProjectID = useSelector(state => selectFirstProjectIdByCurrentUser(state))
  const [projectID, setProjectID] = useState(props.edit ? props.edit.projectID : firstProjectID)
  const selectProjectByProjectID = selectors.makeSelectProjectById
  const project = useSelector(state => selectProjectByProjectID(state, projectID))
  const [name, setName] = useState(props.edit ? props.edit.name : '')
  const [description, setDescription] = useState(props.edit ? props.edit.description : '')
  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = event => {
    event.preventDefault()
    if (!props.edit) {
      dispatch(
        actions.instantiateCategory({
          name: name,
          description: description,
          projectID: parseInt(projectID),
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
          projectID: parseInt(projectID),
        })
      ).then(() => history.goBack())
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
        setProjectID(parseInt(event.target.value))
        break

      default:
        break
    }
  }

  return (
    <Modal>
      <>
        <h1 className="fit margin-auto">{props.edit ? 'Edit' : 'New'} Category</h1>
        <form onSubmit={handleSubmit} className="pure-form pure-form-stacked fit margin-auto">
          <fieldset>
            <label htmlFor="name">Name</label>
            <input
              className="pure-input-1"
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
            />
            <label htmlFor="description">Description</label>
            <textarea
              className="pure-input-1"
              name="description"
              value={description}
              onChange={handleChange}
            />
            <label htmlFor="projectID" className="hoverable">
              {projects.length > 0 && project && (
                <Hover>
                  <Project project={project} showCategories />
                </Hover>
              )}
              Project
              <select
                className="pure-input-1"
                name="projectID"
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
            <button className="pure-button pure-button-primary" type="submit">
              Submit
            </button>
          </fieldset>
        </form>
      </>
    </Modal>
  )
})

CategoryForm.displayName = 'CategoryForm'
export default CategoryForm
