import React from 'react'
import { connect } from 'react-redux';
import { FaMoneyBillAlt } from 'react-icons/fa';

import { NavLink } from '../../router';
import Error from '../../Error/Error';

import { OPERATION_CURRENT_BALANCE, OPERATION_NEW_TRANSFER, selectOperation } from '../../state/actions/operations';
import { ERROR_ACCOUNTS_FETCH_FAILED } from '../../state/actions/errors';

import './Accounts.scss';

const Accounts = ({accounts, selectOperation, ...props}) => {
  return (
    <div className="accounts-overview">
      <div className="accounts-sum">
        <div>Your values</div>
        <div><strong>220.33 EUR</strong></div>
      </div>
      <ul className="accounts-list">
        <Error codes={[ERROR_ACCOUNTS_FETCH_FAILED]} />
        { accounts && accounts.map((account, key) => (
          <li key={key}>
            <div className="account">
              <div className="account-icon">
                <div>
                  <FaMoneyBillAlt />
                </div>
                <span className="account-currency">
                  {account.currency}
                </span>
              </div>
              <div className="account-details">
                <h4 className="account-name">
                  {account.account_name==null ? "ACME Bank Standard account" : account.account_name}
                </h4>
                <div className="account-iban">
                  {account.iban}
                </div>
                <div className="account-controls">
                  <NavLink to={OPERATION_CURRENT_BALANCE}
                           params={{accountId: account.account_id}}
                           className="banking-button active">Go to balance</NavLink>

                  <NavLink to={OPERATION_NEW_TRANSFER}
                           params={{accountId: account.account_id}}
                           className="banking-button">New cash transfer</NavLink>

                  <button className="banking-button">Cards</button>
                  <button className="banking-button">Close the account</button>
                </div>
              </div>
            </div>
          </li>
        )) }
      </ul>
    </div>

  )
}

const mapStateToProps = state => ({
  accounts: state.accounts.accounts
});

const mapDispatchToProps = dispatch => ({
  selectOperation: (...args) => dispatch(selectOperation(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
