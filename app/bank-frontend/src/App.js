import React from 'react';
import './App.scss';
import { connect } from 'react-redux';
import { FaRegUserCircle, FaUnlockAlt } from 'react-icons/fa';

import { logout } from "./state/actions/session";

import LoginForm from './LoginForm/LoginForm';
import WorkingArea from './WorkingArea/WorkingArea';
import Landing from './Landing/Landing';

const App = ({currentUser, logout, ...props}) => (
  <div className="banking-app" {...props}>
    <div className="banking-app-header">
      <div className="logo">
        acmeBank
      </div>

      { currentUser &&
        <div className="user-data">
          <FaRegUserCircle /> Welcome, { currentUser.name }
          &nbsp; | &nbsp;
          <button className="banking-button banking-button-white" onClick={ () => logout() }>
            <FaUnlockAlt />
            &nbsp;
            Logout
          </button>
        </div>
      }
    </div>

    { !currentUser ? (
      <Landing>
        <LoginForm />
      </Landing>
    )
    : (
      <div className="banking-app-container">
        <WorkingArea />
      </div>
    )}





  </div>
)

const mapStateToProps = state => ({
  currentUser: state.session.currentUser
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
