import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { FaMoneyBillAlt } from 'react-icons/fa';

import { OPERATION_CURRENT_BALANCE, OPERATION_NEW_TRANSFER, selectOperation } from '../../../state/actions/operations';
import { NavLink } from '../../../router';
import FormattedCashAmount from '../../../FormattedCashAmount/FormattedCashAmount';

import './Account.scss';

const Account = ({
  currency,
  account_name,
  id,
  iban,
  balance
}) => {
  return (
    <div className="account">
      <div className="account-icon">
        <div>
          <FaMoneyBillAlt />
        </div>
        <span className="account-currency">
          {currency}
        </span>
      </div>
      <div className="account-details">
        <h4 className="account-name">
          {account_name==null ? "ACME Bank Standard account" : account_name}
        </h4>
        <div className="account-iban">
          <span>{iban}</span>
          { balance && <strong>
            <span>&nbsp;| Balance: </span>
            <FormattedCashAmount amount={balance} currency={currency} />
          </strong> }
        </div>
        <div className="account-controls">
          <NavLink to={OPERATION_CURRENT_BALANCE}
                   params={{accountId: id}}
                   className="banking-button active">Go to balance</NavLink>

          <NavLink to={OPERATION_NEW_TRANSFER}
                   params={{accountId: id}}
                   className="banking-button">New cash transfer</NavLink>

          <button className="banking-button">Cards</button>
          <button className="banking-button">Close the account</button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  selectOperation: (...args) => dispatch(selectOperation(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);
