import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import actions from '../actions/index'
import selectors from '../selectors'
import Category from './Category'
import Hover from './Hover'
import { Modal } from './index'

const TodoForm = React.memo(props => {
  const selectFirstProjectIdByCurrentUser = selectors.makeSelectFirstCategoryIdByCurrentUserId
  const selectCategoriesByCurrentUserID = selectors.makeSelectCategoriesByCurrentUserId
  const categories = useSelector(state => selectCategoriesByCurrentUserID(state))
  const firstCategoryID = useSelector(state => selectFirstProjectIdByCurrentUser(state))
  const [categoryID, setCategoryID] = useState(props.edit ? props.edit.categoryID : firstCategoryID)
  const selectCategoryByTodoEditCategoryID = selectors.makeSelectCategoryById
  const category = useSelector(state => selectCategoryByTodoEditCategoryID(state, categoryID))
  const [name, setName] = useState(props.edit ? props.edit.name : '')
  const [description, setDescription] = useState(props.edit ? props.edit.description : '')
  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = event => {
    event.preventDefault()
    if (!props.edit) {
      dispatch(
        actions.instantiateTodo({
          name: name,
          description: description,
          categoryID: parseInt(categoryID),
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
          categoryID: parseInt(categoryID),
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
        <h1 className="fit margin-auto">{props.edit ? 'Edit' : 'New'} Todo</h1>
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
            <label htmlFor="categoryID" className="hoverable">
              {categories.length > 0 && category && (
                <Hover>
                  <Category category={category} showTodos showProject />
                </Hover>
              )}
              Category
              <select
                className="pure-input-1"
                name="categoryID"
                value={categoryID}
                onChange={handleChange}
              >
                {categories.map((category, i) => (
                  <option value={category.id} key={i}>
                    {category.name}
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
export default TodoForm
