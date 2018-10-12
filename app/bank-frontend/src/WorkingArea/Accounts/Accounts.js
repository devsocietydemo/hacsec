import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { OPERATION_CURRENT_BALANCE, selectOperation } from '../../state/actions/operations';

import './Accounts.scss';

const Accounts = ({accounts, selectOperation, ...props}) => {
  return (
    <ul className="accounts-list">
      { accounts && accounts.map(account => (
        <li>
          <button className="account" onClick={() => selectOperation(OPERATION_CURRENT_BALANCE, account.account_id)}>
            <h4 className="account-name">
              ACME STANDARD Account
            </h4>
            <div>
              Number: {account.account_id}
            </div>
          </button>
        </li>
      )) }
    </ul>
  )
}

const mapStateToProps = state => ({
  accounts: state.accounts.accounts
});

const mapDispatchToProps = dispatch => ({
  selectOperation: (...args) => dispatch(selectOperation(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
