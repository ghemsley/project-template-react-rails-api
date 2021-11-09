import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMountedState, usePromise } from 'react-use'
import actions from '../actions'
import helpers from '../helpers'

const authHooks = {
  useCheckAuth: () => {
    const [data, setData] = useState(null)
    const [error, setErrors] = useState(null)
    const dispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const authorize = useCallback(url => helpers.fetcher(url, 'GET', true), [])
    const run = useCallback(async () => {
      const data = await mounted(authorize('/current_user'))
      if (data?.user) {
        if (isMounted()) await mounted(dispatch(actions.setAuthenticated(data)))
        if (isMounted()) setData(data)
      } else {
        // console.log('error', data)
        helpers.deleteToken()
        if (isMounted()) await mounted(dispatch(actions.setUnauthenticated()))
        if (isMounted()) setErrors(data?.error ? data.error : null)
      }
    }, [isMounted, dispatch, mounted, authorize])
    useEffect(() => {
      if (isMounted()) mounted(run())
    }, [])
    return [data, error]
  },
  useSignupUser: async (email, password, confirmPassword, start, setErrors) => {
    const [data, setData] = useState(null)
    const dispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const signupUser = useCallback(
      url => helpers.fetcher(url, 'POST', false, { email, password, confirmPassword }),
      [confirmPassword, email, password]
    )
    const run = useCallback(async () => {
      const data = await mounted(signupUser('/signup'))
      if (data?.user) {
        if (isMounted()) await mounted(dispatch(actions.setAuthenticated(data)))
      } else {
        // console.log('error', data)
      }
      return [data, data?.error ? data.error : null]
    }, [isMounted, mounted, dispatch, signupUser])
    useEffect(() => {
      if (start && isMounted())
        mounted(
          run().then(([data, error]) => {
            if (isMounted()) setData(data)
            if (isMounted()) setErrors(error)
          })
        )
    }, [start, isMounted, mounted, run, setErrors])
    return [data, data?.error ? data.error : null]
  },
  useLoginUser: async (email, password, start, setErrors) => {
    const [data, setData] = useState(null)
    const dispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const loginUser = useCallback(
      url => helpers.fetcher(url, 'POST', false, { user: { email, password } }),
      [email, password]
    )
    const run = useCallback(async () => {
      const data = await mounted(loginUser('/login'))
      if (data?.user) {
        if (isMounted()) await mounted(dispatch(actions.setAuthenticated(data)))
      } else {
        // console.log('error', data)
      }
      return [data, data?.error ? data.error : null]
    }, [dispatch, isMounted, mounted, loginUser])
    useEffect(() => {
      if (start && isMounted())
        mounted(
          run().then(([data, error]) => {
            if (isMounted()) {
              setErrors([error])
              setData(data)
            }
          })
        )
    }, [start, isMounted, mounted, run, setErrors])
    return [data, data?.error ? data.error : null]
  },
  useLogoutUser: () => {
    const dispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const [data, setData] = useState(null)
    const [error, setErrors] = useState(null)
    const logoutUser = useCallback(url => helpers.fetcher(url, 'GET', true), [])
    const run = useCallback(async () => {
      const data = await mounted(logoutUser('/logout'))
      helpers.deleteToken()
      if (isMounted()) await mounted(dispatch(actions.setUnauthenticated()))
      if (typeof data?.token === 'string') {
        console.log('token', data.token)
        if (isMounted()) setData(data)
      } else {
        // console.log('error', data)
        if (isMounted()) setErrors(data?.error ? data.error : null)
      }
    }, [isMounted, mounted, dispatch, logoutUser])
    useEffect(() => {
      if (isMounted()) mounted(run())
    }, [])
    return [data, error]
  },
}

export default authHooks
