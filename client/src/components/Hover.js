import React, { useState, useLayoutEffect, useMemo } from 'react'
import { v4 as uuid } from 'uuid'

const Hover = React.memo(props => {
  const [hidden, setHidden] = useState(true)
  const [left, setLeft] = useState(window.innerWidth)
  const [top, setTop] = useState(window.innerHeight)
  const [elementLeft, setElementLeft] = useState(0)
  const [elementTop, setElementTop] = useState(0)
  const id = useMemo(() => uuid(), [])

  useLayoutEffect(() => {
    const handlePointerEnter = event => {
      event.stopPropagation()
      setHidden(false)
    }
    const handlePointerLeave = event => {
      event.stopPropagation()
      setHidden(true)
    }
    const handlePointerMove = event => {
      event.stopPropagation()
      setLeft(event.clientX)
      setTop(event.clientY)
    }
    const child = document.getElementById(id)
    const parent = child ? child.closest('.hoverable') : null
    if (parent) {
      const rect = parent.getBoundingClientRect()
      setElementLeft(rect.left)
      setElementTop(rect.top)
      parent.addEventListener('pointerenter', handlePointerEnter, {
        once: true,
        passive: true
      })
      parent.addEventListener('pointerleave', handlePointerLeave, {
        once: true,
        passive: true
      })
      parent.addEventListener('pointermove', handlePointerMove, {
        passive: true
      })
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
        transform: `translate3d(${left - elementLeft + 32}px, ${
          top - elementTop + 32
        }px, 0px)`
      }}
      className={`hover center center-text fit ${
        hidden ? 'fadeout' : 'fadein'
      }`}>
      {props.children}
    </div>
  )
})

export default Hover
