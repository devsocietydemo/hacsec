import React from 'react'
import { connect } from 'react-redux';

import { init } from '../state/actions/session';
import { setEmail, setHostname, setUserHash, resetUserData, encrypt } from '../state/actions/encrypt';
import { ERROR_INIT_FAILED, ERROR_SESSION_NOT_SET, ERROR_HASH_NOT_VALID, ERROR_ENCRYPT_FAILED } from '../state/actions/errors';
import Error from '../Error/Error';

import FormGroup from '../FormGroup/FormGroup';

import './LoginForm.scss';

const LoginForm = ({email, hostname, hash, error, init, setEmail, setHostname, setUserHash, resetUserData, encrypt, ...props}) => {
  return (
    <div className="login-form" {...props}>
      <form onSubmit={ (e) => { e.preventDefault(); encrypt() } }>
        <FormGroup label="E-Mail address">
          <input className="test-input"
                 disabled={ hash !== '' }
                 type="email"
                 onChange={(e) => setEmail(e.target.value)}
                 title="Please enter valid e-mail"
                 value={email} />
        </FormGroup>

        <FormGroup label="Hostname">
          <input className="test-input"
                 type="text"
                 disabled={ hash !== '' }
                 onChange={(e) => setHostname(e.target.value)}
                 value={hostname} />
        </FormGroup>
        { !hash && 
          <div className="login-form-submit">
            <button className="test-button active test-button-big" type="submit">Encrypt</button>
          </div>
        }
        { hash && 
          <div className="login-form-reset">
            <button className="test-button active test-button-big" type="reset" onClick={ (e) => { e.preventDefault(); resetUserData()}}>Reset</button>
          </div>
        }

        <Error codes={[ERROR_INIT_FAILED, ERROR_SESSION_NOT_SET, ERROR_HASH_NOT_VALID, ERROR_ENCRYPT_FAILED]} />
      </form>
    </div>
  )
}

const mapStateToProps = state => ({
  email: state.encrypt.email,
  hostname: state.encrypt.hostname,
  hash: state.encrypt.hash,
  error: state.session.error
});

const mapDispatchToProps = dispatch => ({
  setEmail: email => dispatch(setEmail(email)),
  setHostname: hostname => dispatch(setHostname(hostname)),
  setUserHash: hash => dispatch(setUserHash(hash)),
  resetUserData: () => dispatch(resetUserData()),
  init: () => dispatch(init()),
  encrypt: () => dispatch(encrypt())
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
