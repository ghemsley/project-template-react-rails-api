import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../actions/index'
import Hover from './Hover'
import Category from './Category'

const TodoForm = () => {
  const categories = useSelector(state => state.categories)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categoryID, setCategoryID] = useState(categories[0] ? categories[0].id : '')
  const dispatch = useDispatch()

  const handleSubmit = event => {
    event.preventDefault()
    dispatch(
      actions.createTodo({
        name: name,
        description: description,
        categoryID: categoryID
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

      case 'categoryID':
        setCategoryID(event.target.value)
        break

      default:
        break
    }
  }

  return (
    <>
      {categories.length < 1 ? (
        <p>Please create a category first before trying to create a todo!</p>
      ) : (
        <form onSubmit={handleSubmit} className='pure-form pure-form-stacked center fit'>
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
            <label htmlFor='categoryID' className='hoverable'>
              Category
              <select
                name='categoryID'
                value={categoryID}
                onChange={handleChange}
              >
                {categories.map((category, i) => (
                  <option value={category.id} key={i}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length > 0 && (
                <Hover>
                  <Category
                    category={categories.find(category => category.id === categoryID)}
                    showTodos={true}
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
export default TodoForm