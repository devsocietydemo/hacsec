import React from 'react'
import { connect } from 'react-redux';

import Error from '../../Error/Error';
import { ERROR_BALANCE_FETCH_FAILED } from '../../state/actions/errors';

const CurrentBalance = ({ transactions, accountId, ...props }) => {
  return (
    <div className="current-balance" {...props}>

      <Error codes={[ERROR_BALANCE_FETCH_FAILED]} />
      <div className="current-balance-header">
        Current balance of Account ID: { accountId }
      </div>

      <ul>
        { transactions.map(({id}, key) => (
          <li key={key}>
            { id }
          </li>
        )) }
      </ul>
    </div>
  )
}

const mapStateToProps = state => ({
  transactions: state.currentBalance.transactions,
  accountId: state.currentBalance.accountId
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentBalance);
