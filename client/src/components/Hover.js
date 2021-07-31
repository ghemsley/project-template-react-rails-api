import React, { useState, useLayoutEffect } from 'react'
import { v4 as uuid } from 'uuid'

const Hover = props => {
  const [hidden, setHidden] = useState(true)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [left, setLeft] = useState(window.innerWidth)
  const [top, setTop] = useState(window.innerHeight)
  const [elementLeft, setElementLeft] = useState(0)
  const [elementTop, setElementTop] = useState(0)
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
      const rect = parent.getBoundingClientRect()
      setWidth(rect.width)
      setHeight(rect.height)
      setElementLeft(rect.left)
      setElementTop(rect.top)
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
        zIndex: 1000,
        transition: 'opacity 0.25s ease 0s',
        transform: `translate(${
          left - elementLeft + 12
        }px, ${top - elementTop - 40}px)`
      }}
      className={`center fit ${hidden ? 'fadeout' : 'fadein'}`}
    >
      {props.children}
    </div>
  )
}

export default Hover
