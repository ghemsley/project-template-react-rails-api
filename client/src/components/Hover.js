import React, { useState, useLayoutEffect } from 'react'
import { v4 as uuid } from 'uuid'

const Hover = props => {
  const [hidden, setHidden] = useState(true)
  const [left, setLeft] = useState(window.innerWidth)
  const [top, setTop] = useState(window.innerHeight)
  const [elementLeft, setElementLeft] = useState(0)
  const [elementTop, setElementTop] = useState(0)
  const [display, setDisplay] = useState(true)
  const id = uuid()

  useLayoutEffect(() => {
    let timer = null
    const handlePointerEnter = event => {
      event.stopPropagation()
      setDisplay(true)
      setHidden(false)
    }
    const handlePointerLeave = event => {
      event.stopPropagation()
      setHidden(true)
      timer = setTimeout(() => {
        setDisplay(false)
      }, 333)
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
      clearTimeout(timer)
      parent.removeEventListener('pointerenter', handlePointerEnter)
      parent.removeEventListener('pointerleave', handlePointerLeave)
      parent.removeEventListener('pointermove', handlePointerMove)
    }
  }, [hidden, id, setHidden, setLeft, setTop])
  const cancelHover = () => {setDisplay(false)}
  return (
    <div
      id={id}
      style={{
        position: 'fixed',
        color: 'whitesmoke',
        transition: 'opacity 0.333s ease 0ms',
        transform: `translate3d(${
          left - elementLeft + 32
        }px, ${top - elementTop + 32}px, 0px)`,
        display: display ? 'block' : 'none'
      }}
      className={`center fit ${hidden ? 'fadeout' : 'fadein'}`}
      onPointerEnter={cancelHover}
    >
      {props.children}
    </div>
  )
}

export default Hover
