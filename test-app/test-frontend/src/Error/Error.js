import React from 'react'
import { connect } from 'react-redux';

import { IoIosCloseCircleOutline } from 'react-icons/io';

import {
   ERROR_LOGIN_NOT_FOUND,
   ERROR_LOGIN_FETCH_FAILED,
   ERROR_LOGIN_FAILED,
   ERROR_SESSION_NOT_SET,
   ERROR_HASH_NOT_VALID
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
  [ERROR_LOGIN_NOT_FOUND]:
    <ErrorBody title="Login error">
      Probably You have written wrong login credentials. Please check, if You have correct access data and try again.
    </ErrorBody>,
  [ERROR_LOGIN_FETCH_FAILED]:
    <ErrorBody title="Login error">
      Something is going on with the authentication server. Try again later.
    </ErrorBody>,
  [ERROR_LOGIN_FAILED]:
    <ErrorBody title="Login failed">
      Something is going wrong with login operation.
    </ErrorBody>,
  [ERROR_SESSION_NOT_SET]:
    <ErrorBody title="Session not set">
      The server wasn't able to establish session yet.
    </ErrorBody>,
  [ERROR_HASH_NOT_VALID]:
    <ErrorBody title="Hash calculation failure">
      The server is not able to calculate hash.
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
