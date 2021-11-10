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
  useSignupUser: async (username, email, password, confirmPassword, start, setErrors) => {
    const [data, setData] = useState(null)
    const dispatch = useDispatch()
    const mounted = usePromise()
    const isMounted = useMountedState()
    const signupUser = useCallback(
      url =>
        helpers.fetcher(url, 'POST', false, {
          user: {
            username,
            email,
            password,
            password_confirmation: confirmPassword,
          },
        }),
      [username, email, password, confirmPassword]
    )
    const run = useCallback(async () => {
      const data = await mounted(signupUser('/signup'))
      if (data?.user) {
        if (isMounted()) await mounted(dispatch(actions.setAuthenticated(data)))
      } else {
        // console.log('error', data)
        if (data?.status?.message) setErrors([data.status.message])
      }
      return data
    }, [isMounted, mounted, dispatch, signupUser])
    useEffect(() => {
      if (start && isMounted())
        mounted(
          run().then(data => {
            if (isMounted()) setData(data)
          })
        )
    }, [start, isMounted, mounted, run, setErrors])
    return data
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
    const logoutUser = useCallback(url => helpers.fetcher(url, 'DELETE', true), [])
    const run = useCallback(async () => {
      const data = await mounted(logoutUser('/logout'))
      // console.log('data', data)
      helpers.deleteToken()
      if (isMounted()) await mounted(dispatch(actions.setUnauthenticated()))
      if (data?.status === 200) {
        if (isMounted()) setData(data)
      } else if (data?.status === 401) {
        if (isMounted()) setErrors(data?.message ? data.message : null)
      }
    }, [isMounted, mounted, dispatch, logoutUser])
    useEffect(() => {
      if (isMounted()) mounted(run())
    }, [])
    return [data, error]
  },
}

export default authHooks
