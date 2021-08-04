import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { useSelector } from 'react-redux'

const Dropzone = props => {
  const coordinates = useSelector(state => state.coordinates)
  const [
    { isOver, canDrop, cursor, type, dragElementOffset, item, delta },
    drop
  ] = useDrop({
    accept: ['todo', 'category', 'project'],
    drop: (item, monitor) => {
      const childCoordinates = coordinates.find(coords => {
        switch (props.parentCoordinates.type) {
          case 'project':
            return coords.type === 'category' && coords.item.id === item.id

          case 'category':
            return coords.type === 'todo' && coords.item.id === item.id

          default:
            return null
        }
      })
      const result = {
        child: childCoordinates,
        parent: props.parentCoordinates,
        cursor: monitor.getClientOffset(),
        element: monitor.getSourceClientOffset(),
        delta: monitor.getDifferenceFromInitialOffset()
      }
      props.handleDrop(item, result)
      return result
    },
    canDrop: (item, monitor) => {
      return type === props.acceptType
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      type: monitor.getItemType(),
      cursor: monitor.getClientOffset(),
      dragElementOffset: monitor.getSourceClientOffset(),
      delta: monitor.getDifferenceFromInitialOffset(),
      item: monitor.getItem()
    })
  })
  return (
    <div ref={drop} className='dropzone'>
      {props.children}
    </div>
  )
}

export default Dropzone
