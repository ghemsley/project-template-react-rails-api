import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import actions from '../actions/index'
import Modal from './Modal'

const ProjectForm = React.memo(props => {
  const [name, setName] = useState(props.edit ? props.edit.name : '')
  const [description, setDescription] = useState(props.edit ? props.edit.description : '')
  const [privateProject, setPrivateProject] = useState(props.edit ? props.edit.private : true)
  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = event => {
    event.preventDefault()
    if (!props.edit) {
      dispatch(
        actions.instantiateProject({
          name: name,
          description: description,
          private: privateProject,
        })
      )
      setName('')
      setDescription('')
    } else {
      dispatch(
        actions.amendProject({
          ...props.edit,
          name: name,
          description: description,
          private: privateProject,
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
      case 'private':
        setPrivateProject(!privateProject)
        break

      default:
        break
    }
  }

  return (
    <Modal>
      <h1 className="fit margin-auto">{props.edit ? 'Edit' : 'New'} Project</h1>
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
          <label htmlFor="private">
            Private
            <input
              className="pure-checkbox"
              name="private"
              type="checkbox"
              checked={privateProject}
              onChange={handleChange}
            />
          </label>
          <button className="pure-button pure-button-primary" type="submit">
            Submit
          </button>
        </fieldset>
      </form>
    </Modal>
  )
})
export default ProjectForm
