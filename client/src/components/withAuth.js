import React, { Component } from 'react'
import { connect } from 'react-redux'
import ConfirmScreen from './ConfirmScreen'
import actions from '../actions'

const withAuth = WrappedComponent => {
  class StupidClassComponent extends Component {
    componentDidMount() {
      const { checkAuth } = this.props
      checkAuth().catch(error => console.error(error))
    }
    render() {
      const { loggedIn, protectedRoute } = this.props
      if (!loggedIn && protectedRoute) {
        return (
          <ConfirmScreen {...this.props} closeAction={() => this.props.history.push('/')}>
            <p>You must be logged in to view this page</p>
          </ConfirmScreen>
        )
      } else return <WrappedComponent {...this.props} />
    }
  }

  const mapStateToProps = state => ({
    authChecked: state.authentication.authChecked,
    loggedIn: state.authentication.loggedIn,
    currentUser: state.authentication.currentUser,
  })
  const mapDispatchToProps = dispatch => ({
    checkAuth: () => dispatch(actions.checkAuth()),
  })

  return connect(mapStateToProps, mapDispatchToProps)(StupidClassComponent)
}

export default withAuth
