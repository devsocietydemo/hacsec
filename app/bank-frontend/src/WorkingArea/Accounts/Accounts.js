import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { FaMoneyBillAlt } from 'react-icons/fa';

import { NavLink } from '../../router';

import { OPERATION_CURRENT_BALANCE, selectOperation } from '../../state/actions/operations';

import './Accounts.scss';

const Accounts = ({accounts, selectOperation, ...props}) => {
  return (
    <div className="accounts-overview">
      <div className="accounts-sum">
        <div>Your values</div>
        <div><strong>220.33 EUR</strong></div>
      </div>
      <ul className="accounts-list">
        { accounts && accounts.map(account => (
          <li>
            <div className="account">
              <div className="account-icon">
                <FaMoneyBillAlt />
              </div>
              <div className="account-details">
                <h4 className="account-name">
                  {account.account_name==null ? "ACME Bank Standard account" : account.account_name}
                </h4>
                <div className="account-iban">
                  PL61 1090 1014 0000 0712 1981 2874
                </div>
                <div className="account-controls">
                  <NavLink to={OPERATION_CURRENT_BALANCE}
                           params={{accountId: account.account_id}}
                           className="banking-button active">Go to balance</NavLink>

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
