import React from 'react'
import { connect } from 'react-redux';

import { IoIosCloseCircleOutline } from 'react-icons/io';

import {
   ERROR_LOGIN_NOT_FOUND,
   ERROR_LOGIN_FETCH_FAILED,
   ERROR_TRANSFER_FAILED,
   ERROR_NEW_TRANSFER_ACCOUNTS_FETCH_FAILED,
   ERROR_ACCOUNTS_FETCH_FAILED,
   ERROR_BALANCE_ACCOUNTS_FETCH_FAILED
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
  [ERROR_TRANSFER_FAILED]:
    <ErrorBody title="Transfer failed">
      Something is going wrong with creating new funds transfer. Try again later or contact the service desk.
    </ErrorBody>,
  [ERROR_NEW_TRANSFER_ACCOUNTS_FETCH_FAILED]:
    <ErrorBody title="Transfer failed">
      The server is not able to get the accounts.
    </ErrorBody>,
  [ERROR_ACCOUNTS_FETCH_FAILED]:
    <ErrorBody title="Accounts preview failed">
      The server is not able to get the accounts.
    </ErrorBody>,
  [ERROR_BALANCE_ACCOUNTS_FETCH_FAILED]:
    <ErrorBody title="Accounts balance preview failed">
      The server is not able to get the accounts.
    </ErrorBody>
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
