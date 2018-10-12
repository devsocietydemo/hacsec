import React, { Component } from 'react';
import './App.css';

import LoginForm from './LoginForm/LoginForm';

class App extends Component {
  render() {
    return (
      <div className="banking-app">
        <h2>Welcome to the ACME Internet Banking!</h2>

        <LoginForm />
      </div>
    );
  }
}

export default App;
