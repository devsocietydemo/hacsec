import React from 'react'
import { connect } from 'react-redux';
import { routes } from '../routes';
import { NavLink, Route } from '../router';

import {OPERATION_ACCOUNTS, OPERATION_NEW_TRANSFER, OPERATION_CURRENT_BALANCE,
    OPERATION_CONTACTS, selectOperation } from '../state/actions/operations';

import Accounts from './Accounts/Accounts';
import CurrentBalance from './CurrentBalance/CurrentBalance';
import NewTransfer from './NewTransfer/NewTransfer';
import Contacts from './Contacts/Contacts';

import './WorkingArea.scss';

const WorkingArea = ({selectOperation, currentOperation, ...props}) => {
  return (
    <div className="operations">
      <ul className="operation-chooser">
        { routes.filter(route => route.inMainMenu).map((operation, key) => (
          <li key={key}>
            <NavLink className="banking-button" activeClassName="active" to={operation.id}>
              {operation.name}
            </NavLink>
          </li>
        )) }
      </ul>

      <Route id={OPERATION_ACCOUNTS}>
        <Accounts />
      </Route>

      <Route id={OPERATION_CURRENT_BALANCE}>
        <CurrentBalance />
      </Route>

      <Route id={OPERATION_NEW_TRANSFER}>
        <NewTransfer />
      </Route>

      <Route id={OPERATION_CONTACTS}>
        <Contacts />
      </Route>
    </div>
  )
}

const mapStateToProps = state => ({
  currentOperation: state.operations.operation
});

const mapDispatchToProps = dispatch => ({
  selectOperation: (operation) => dispatch(selectOperation(operation))
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkingArea);
