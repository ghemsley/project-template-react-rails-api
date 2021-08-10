import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import actions from '../actions/index'
import Hover from './Hover'
import Category from './Category'
import { Modal } from './index'
import { useHistory } from 'react-router-dom'
import { makeSelectCategoryByTodoEditCategoryID } from '../selectors/index'
const TodoForm = React.memo(props => {
  const categories = useSelector(state => state.categories)
  const [name, setName] = useState(props.edit ? props.edit.name : '')
  const [description, setDescription] = useState(
    props.edit ? props.edit.description : ''
  )
  const [categoryID, setCategoryID] = useState(
    props.edit ? props.edit.categoryID : categories[0].id
  )
  const selectCategoryByTodoEditCategoryID = useCallback(
    makeSelectCategoryByTodoEditCategoryID,
    [props, categories, categoryID]
  )
  const category = useSelector(state =>
    selectCategoryByTodoEditCategoryID(state, categoryID)
  )
  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = event => {
    event.preventDefault()
    if (!props.edit) {
      dispatch(
        actions.instantiateTodo({
          name: name,
          description: description,
          categoryID: categoryID
        })
      )
      setName('')
      setDescription('')
    } else {
      dispatch(
        actions.amendTodo({
          ...props.edit,
          name: name,
          description: description,
          categoryID: categoryID
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

      case 'categoryID':
        setCategoryID(parseInt(event.target.value))
        break

      default:
        break
    }
  }
  return (
    <Modal>
      <>
        <h1 className='fit margin-auto'>{props.edit ? 'Edit' : 'New'} Todo</h1>
        <form
          onSubmit={handleSubmit}
          className='pure-form pure-form-stacked fit margin-auto'>
          <fieldset>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              name='name'
              value={name}
              onChange={handleChange}
            />
            <label htmlFor='description'>Description</label>
            <textarea
              name='description'
              value={description}
              onChange={handleChange}
            />
            <label htmlFor='categoryID' className='hoverable'>
              {categories.length > 0 && (
                <Hover>
                  <Category category={category} showTodos showProject />
                </Hover>
              )}
              Category
              <select
                name='categoryID'
                value={categoryID}
                onChange={handleChange}>
                {categories.map((category, i) => (
                  <option value={category.id} key={i}>
                    {category.name}
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
    </Modal>
  )
})
export default TodoForm
