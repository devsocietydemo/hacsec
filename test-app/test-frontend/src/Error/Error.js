import React from 'react'
import { connect } from 'react-redux';

import { IoIosCloseCircleOutline } from 'react-icons/io';

import {
  ERROR_INIT_FAILED,
  ERROR_SESSION_NOT_SET,
  ERROR_HASH_NOT_VALID,
  ERROR_ENCRYPT_FAILED
} from '../state/actions/errors';

import './Error.scss';

const ErrorBody = ({children, title}) => {
  return (
    <div>
      <h4>{ title }</h4>
      <br />
      {children}
    </div>
  )
}

const errorViews = {
  [ERROR_INIT_FAILED]:
    <ErrorBody title="Init failed">
      Session initialization failed, please reload page and try again. If the problem persists, contact system administrator.
    </ErrorBody>,
  [ERROR_SESSION_NOT_SET]:
    <ErrorBody title="Session not set">
      Session expired, please reload page to initialize new session. If the problem persists, contact system administrator.
    </ErrorBody>,
  [ERROR_HASH_NOT_VALID]:
    <ErrorBody title="Hash not valid">
      Encryption operation returned invalid hash. Please reload page and try again. If the problem persists, contact system administrator.
    </ErrorBody>,
  [ERROR_ENCRYPT_FAILED]:
    <ErrorBody title="Encryption failed">
      Encryption operation failed. Please reload page and try again. If the problem persists, contact system administrator.
    </ErrorBody>,
};

const Error = ({errors, ...props}) => {
  return errors.map( (error, idx) => (
    <div className="alert-error" key={idx} {...props}>
      <div className="alert-error-icon">
        <IoIosCloseCircleOutline />
      </div>
      <div className="alert-error-description">
        { errorViews[error.code] }
      </div>
    </div>
  ))
}

const mapStateToProps = (state, ownProps) => ({
  errors: state.errors.errors
    .filter(error =>
      ownProps.codes.indexOf(error.code) !== -1
      && error.time > new Date().getTime() - 5000
    )
    .reduce((errors, errorToAdd) => {
      if (!errors.find(error => error.code === errorToAdd.code)) {
        errors.push(errorToAdd);
      }
      return errors;
    }, [])
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Error);
