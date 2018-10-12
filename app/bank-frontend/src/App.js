import React from 'react';
import './App.scss';
import { connect } from 'react-redux';

import LoginForm from './LoginForm/LoginForm';
import WorkingArea from './WorkingArea/WorkingArea';

const App = ({currentUser, ...props}) => (
  <div className="banking-app" {...props}>
    <div className="banking-app-header">
      <div className="logo">
        acmeBank
      </div>

      { currentUser &&
        <div className="user-data">
          Welcome, { currentUser.name }
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

})

export default connect(mapStateToProps, mapDispatchToProps)(App);
