import React, { useState, useLayoutEffect } from 'react'
import {v4 as uuid} from 'uuid'

const Hover = props => {
  const [hidden, setHidden] = useState(true)
  const [left, setLeft] = useState(window.innerWidth)
  const [top, setTop] = useState(window.innerHeight)
  const id = uuid()

  useLayoutEffect(() => {
    const handlePointerEnter = () => {
      setHidden(false)
    }
    const handlePointerLeave = () => {
      setHidden(true)
    }
    const handlePointerMove = event => {
      setLeft(event.clientX)
      setTop(event.clientY)
    }
    const child = document.getElementById(id)
    const parent = child ? child.closest('.hoverable') : null
    if (parent) {
      parent.addEventListener('pointerenter', handlePointerEnter, {
        once: true
      })
      parent.addEventListener('pointerleave', handlePointerLeave, {
        once: true
      })
      parent.addEventListener('pointermove', handlePointerMove)
    }
    return () => {
      parent.removeEventListener('pointerenter', handlePointerEnter)
      parent.removeEventListener('pointerleave', handlePointerLeave)
      parent.removeEventListener('pointermove', handlePointerMove)
    }
  }, [hidden, id, setHidden, setLeft, setTop])

  return (
    <div
      id={id}
      style={{
        position: 'fixed',
        color: 'whitesmoke',
        left: left + 8,
        top: top + 16,
        zIndex: 1000,
        transition: 'opacity 0.25s ease 0s',
      }}
      className={`center fit ${hidden ? 'fadeout' : 'fadein'}`}
    >
      {props.children}
    </div>
  )
}

export default Hover
