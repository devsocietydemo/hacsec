import React from 'react'
import { connect } from 'react-redux';
import Error from '../../Error/Error';

import { ERROR_ACCOUNTS_FETCH_FAILED } from '../../state/actions/errors';

import Account from './Account/Account';
import './Accounts.scss';

const Accounts = ({accounts, selectOperation, ...props}) => {
  return (
    <div className="accounts-overview">
      <div className="accounts-sum">
      </div>
      <ul className="accounts-list">
        <Error codes={[ERROR_ACCOUNTS_FETCH_FAILED]} />
        { accounts && accounts.map((account, key) => (
          <li key={key}>
            <Account {...account} />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
