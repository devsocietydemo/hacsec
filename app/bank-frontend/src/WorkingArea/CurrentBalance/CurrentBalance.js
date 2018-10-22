import React from 'react'
import { connect } from 'react-redux';
import moment from 'moment';

import Error from '../../Error/Error';
import { ERROR_BALANCE_FETCH_FAILED } from '../../state/actions/errors';

import Transaction from './Transaction';
import './CurrentBalance.scss';

const CurrentBalance = ({ transactions, accountId, ...props }) => {
  return (
    <div className="current-balance" {...props}>

      <Error codes={[ERROR_BALANCE_FETCH_FAILED]} />
      <div className="current-balance-header">
        Current balance of Account ID: { accountId }
      </div>

      <ul className="transactions">
        { transactions.map((transaction, key) => (
          <li key={key}>
            <Transaction { ...transaction } />
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
      transaction_date: moment(tx.transaction_date).format('YYYY-MM-DD HH:mm'),
      transaction_ts: moment(tx.transaction_date).unix()
    }))
    .sort((a, b) => b.transaction_ts - a.transaction_ts),
  accountId: state.currentBalance.accountId
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentBalance);
