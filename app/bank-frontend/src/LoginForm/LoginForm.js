import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { setInputCredentials, authenticate } from '../state/actions/session';

const LoginForm = ({login, password, setLogin, setPassword, authenticate, ...props}) => {
  return (
    <div className="login-form" {...props}>
      <div className="form-group">
        Login: <input type="text" onChange={(e) => setLogin(e.target.value)}
               value={login} />
      </div>
      <div className="form-group">
        Password: <input type="password" onChange={(e) => setPassword(e.target.value)}
               value={password} />
      </div>
      <div>
        <button onClick={() => authenticate()}>Login</button>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  login: state.session.login,
  password: state.session.password
})

const mapDispatchToProps = dispatch => ({
  setLogin: login => dispatch(setInputCredentials('login', login)),
  setPassword: password => dispatch(setInputCredentials('password', password)),
  authenticate: () => dispatch(authenticate())
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
