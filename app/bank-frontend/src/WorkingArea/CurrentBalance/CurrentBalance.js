import React from 'react'
import { connect } from 'react-redux';
import moment from 'moment';

import Error from '../../Error/Error';
import Account from '../Accounts/Account/Account';
import { ERROR_BALANCE_FETCH_FAILED } from '../../state/actions/errors';

import Transaction from './Transaction';
import './CurrentBalance.scss';

const CurrentBalance = ({ transactions, account, ...props }) => {
  return (
    <div className="current-balance" {...props}>

      <Error codes={[ERROR_BALANCE_FETCH_FAILED]} />
      <div className="current-balance-header">
        <Account {...account} />
      </div>

      <h2>Balance:</h2>

      <ul className="transactions">
        { transactions.map((transaction, key) => (
          <li key={key}>
            <Transaction currency={account.currency} { ...transaction } />
          </li>
        )) }
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({
  transactions: state.currentBalance.transactions
    .map(tx => ({
      ...tx,
      transaction_date: moment(tx.transaction_date).format('DD.MM.YYYY, HH:mm'),
      transaction_ts: moment(tx.transaction_date).unix()
    }))
    .sort((a, b) => b.transaction_ts - a.transaction_ts),
  account: state.currentBalance.account
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentBalance);
