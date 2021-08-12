import React from 'react'
import { useSelector } from 'react-redux'
import { ConfirmScreen } from '.'

const Loading = (props) => {
  const authChecked = useSelector(state => state.authentication.authChecked)
  return !authChecked && (
    <ConfirmScreen>
      <h1 className='loading'>Loading...</h1>
    </ConfirmScreen>
  )
}

export default Loading
