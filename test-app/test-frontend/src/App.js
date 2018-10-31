import React from 'react';
import './App.scss';
import { connect } from 'react-redux';
import LoginForm from './LoginForm/LoginForm';
import Landing from './Landing/Landing';
import Spinner from './Spinner/Spinner';

const App = ({...props}) => (
  <div className="test-app" {...props}>
    <div className="test-app-header">
      <div className="logo">
        Hackathon Compatibility Test Application
      </div>
    </div>

    <Landing>
      <LoginForm />
    </Landing>
    <Spinner />
  </div>
)

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
