import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Loading, Modal } from '.'
import actions from '../actions'

function withAuth(WrappedComponent) {
  class StupidClassComponent extends Component {
    componentDidMount() {
      const { checkAuth } = this.props
      checkAuth()
    }
    render() {
      const { authChecked, loggedIn, protectedRoute } = this.props
      if (!authChecked) {
        return <Loading {...this.props} />
      } else if (!loggedIn && protectedRoute) {
        return (
          <Modal {...this.props}>
            <p>You must be logged in to view this page</p>
          </Modal>
        )
      } else return <WrappedComponent {...this.props} />
    }
  }

  const mapStateToProps = state => ({
    authChecked: state.authentication.authChecked,
    loggedIn: state.authentication.loggedIn,
    currentUser: state.authentication.currentUser
  })
  const mapDispatchToProps = dispatch => ({
    checkAuth: () => dispatch(actions.checkAuth())
  })

  return connect(mapStateToProps, mapDispatchToProps)(StupidClassComponent)
}

export default withAuth
