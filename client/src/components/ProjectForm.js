import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import actions from '../actions/index'
import Modal from './Modal'

const ProjectForm = props => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = event => {
    event.preventDefault()
    dispatch(
      actions.instantiateProject({
        name: name,
        description: description
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
      default:
        break
    }
  }

  return (
    <Modal>
      <h1 className='fit margin-auto'>New Project</h1>
      <form
        onSubmit={handleSubmit}
        className='pure-form pure-form-stacked fit margin-auto'
      >
        <fieldset>
          <label htmlFor='name'>Name</label>
          <input type='text' name='name' value={name} onChange={handleChange} />
          <label htmlFor='description'>Description</label>
          <input
            type='text'
            name='description'
            value={description}
            onChange={handleChange}
          />
          <button className='pure-button pure-button-primary' type='submit'>
            Submit
          </button>
        </fieldset>
      </form>
    </Modal>
  )
}
export default ProjectForm
