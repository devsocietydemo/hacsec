import React from 'react';
import './App.scss';
import { connect } from 'react-redux';

import { logout } from "./state/actions/session";

import LoginForm from './LoginForm/LoginForm';
import WorkingArea from './WorkingArea/WorkingArea';

const App = ({currentUser, logout, ...props}) => (
  <div className="banking-app" {...props}>
    <div className="banking-app-header">
      <div className="logo">
        acmeBank
      </div>

      { currentUser &&
        <div className="user-data">
          Welcome, { currentUser.name }
          | <a onClick={ () => logout() }>Logout</a>
        </div>
      }
    </div>

    <div className="banking-app-container">
      { !currentUser ? <LoginForm /> : <WorkingArea /> }
    </div>


  </div>
)

const mapStateToProps = state => ({
  currentUser: state.session.currentUser
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
