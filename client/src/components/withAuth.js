import React, { useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Loading, Modal } from '.'
import actions from '../actions'

function withAuth(WrappedComponent) {
  class StupidClassComponent extends React.Component {
    componentDidMount() {
      const { checkAuth } = this.props
      checkAuth()
    }
    render() {
      const { authChecked, loggedIn } = this.props
      if (!authChecked) {
        return <Loading />
      } else if (!loggedIn) {
        return (
          <Modal>
            <p>You must be logged in to view this page</p>
          </Modal>
        )
      } else return <WrappedComponent {...this.props} />
    }
  }
  const mapStateToProps = state => ({
    authChecked: state.authentication.authChecked,
    loggedIn: state.authentication.loggedIn
  })

  const mapDispatchToProps = dispatch => ({
    checkAuth: () => dispatch(actions.checkAuth())
  })

  return connect(mapStateToProps, mapDispatchToProps)(StupidClassComponent)
}

export default withAuth
