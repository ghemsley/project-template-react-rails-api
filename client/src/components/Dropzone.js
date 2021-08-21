import React, { useCallback } from 'react'
import { useMultiDrop } from 'react-dnd-multi-backend'
import { useDispatch, useSelector } from 'react-redux'
import mergeRefs from 'react-merge-refs'
import selectors from '../selectors'
import actions from '../actions/'

const Dropzone = React.memo(props => {
  const selectChildCoordinates = selectors.makeSelectChildCoordinates
  const childCoordinates = useSelector(state =>
    selectChildCoordinates(state, props)
  )
  const dispatch = useDispatch()
  const handleDrop = useCallback(
    (item, result) => {
      let order = 0
      let i = 0
      while (i < childCoordinates.length) {
        if (childCoordinates[i].item.id !== item.id) {
          if (result.element.y < childCoordinates[i].position.top) {
            order = i
            for (let j = i; j < childCoordinates.length; j++) {
              if (childCoordinates[j].item.id !== item.id) {
                childCoordinates[j].item.order += 1
              }
            }
            if (i === 0) {
              break
            }
            for (let j = i - 1; j >= 0; j--) {
              if (childCoordinates[j].item.id !== item.id) {
                childCoordinates[j].item.order -= 1
              }
            }
            break
          } else {
            order = i + 1
          }
        }
        i++
      }
      const childrenToUpdate = childCoordinates.map(coords => coords.item)
      const existingChild = childrenToUpdate.find(
        existing => existing.id === item.id
      )
      if (!existingChild) {
        const child = { ...item, order: order }
        child[`${props.parentType}ID`] = props.parentID
        childrenToUpdate.push(child)
      } else {
        childrenToUpdate[childrenToUpdate.indexOf(existingChild)].order = order
      }
      childrenToUpdate.sort((child1, child2) => child1.order - child2.order)
      for (let i = 0; i < childrenToUpdate.length; i++) {
        childrenToUpdate[i].order = i
      }
      switch (props.acceptType) {
        case 'todo':
          dispatch(actions.batchAmendTodos(childrenToUpdate))
          break

        case 'category':
          dispatch(actions.batchAmendCategories(childrenToUpdate))
          break

        default:
          break
      }
    },
    [
      props.parentID,
      props.parentType,
      props.acceptType,
      childCoordinates,
      dispatch
    ]
  )

  const [
    [{ type, isOver }],
    {
      html5: [html5Props, html5Drop],
      touch: [touchProps, touchDrop]
    }
  ] = useMultiDrop({
    accept: [props.acceptType],
    drop: (item, monitor) => {
      const result = { element: monitor.getSourceClientOffset() }
      handleDrop(item, result)
      return result
    },
    canDrop: () => {
      return type === props.acceptType
    },
    collect: monitor => ({
      type: monitor.getItemType(),
      isOver: monitor.isOver({shallow: true})
    })
  })
  return (
    <div
      ref={mergeRefs([html5Drop, touchDrop])}
      className='dropzone'
      style={isOver || html5Props.isOver || touchProps.isOver ? { filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 1.0)) brightness(110%)' } : null}>
      {props.children}
    </div>
  )
})

export default Dropzone
