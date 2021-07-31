import React from 'react'
import { useDrop } from 'react-dnd'

const Dropzone = props => {
  const [{ isOver, canDrop, cursor, type, coordinates }, drop] = useDrop({
    accept: ['TODO', 'CATEGORY', 'PROJECT'],
    drop: (item, monitor) => {
      props.handleDrop(item, cursor, coordinates)
    },
    canDrop: (item, monitor) => {
      return type === props.acceptType ? true : false
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      type: monitor.getItemType(),
      cursor: monitor.getClientOffset(),
      coordinates: monitor.getSourceClientOffset()
    })
  })
  return <div ref={drop} className='height-100' >{props.children}</div>
}

export default Dropzone
