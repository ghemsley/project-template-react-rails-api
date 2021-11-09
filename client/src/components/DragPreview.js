import React from 'react'
import { usePreview } from 'react-dnd-multi-backend'

const DragPreview = () => {
  const dragProps = usePreview()
  const PreviewComponent = props => {
    return (
      <div
        ref={props.dragProps.ref}
        style={{
          ...props.dragProps.style,
          color: 'whitesmoke',
          background: '#129fea',
          filter: 'brightness(125%) drop-shadow(0 0 2px rgba(255, 255, 255, 1)',
          borderRadius: '4px',
          padding: '1em',
          zIndex: '1000',
        }}
      >
        <h2>{props.dragProps.itemType.toString()}</h2>
        <h3>{props.dragProps.item.name}</h3>
        <p>{props.dragProps.item.description}</p>
      </div>
    )
  }
  if (!dragProps.display) {
    return null
  } else return <PreviewComponent dragProps={dragProps} />
}

export default DragPreview
