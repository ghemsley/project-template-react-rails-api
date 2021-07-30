import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import actions from '../actions/index'

const ProjectForm = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = event => {
    event.preventDefault()
    dispatch(
      actions.createProject({
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
    <form
      onSubmit={handleSubmit}
      className='pure-form pure-form-stacked center fit'
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
  )
}
export default ProjectForm
