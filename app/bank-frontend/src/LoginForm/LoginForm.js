import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({login, password, setLogin, setPassword, ...props}) => {
  return (
    <div className="login-form" {...props}>
      <div className="form-group">
        Login: <input type="text" onChange={(e) => setLogin(e.target.value)}
               value={login} />
      </div>
      <div className="form-group">
        Password: <input type="password" onChange={(e) => setLogin(e.target.value)}
               value={login} />
      </div>
    </div>
  )
}

export default LoginForm
