import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {OPERATION_ACCOUNTS, OPERATION_NEW_TRANSFER, OPERATION_CURRENT_BALANCE,
    selectOperation } from '../state/actions/operations';

import Accounts from './Accounts/Accounts';

import './WorkingArea.scss';

const operations = [
  {
    id: OPERATION_CURRENT_BALANCE,
    name: 'Current balance'
  },
  {
    id: OPERATION_ACCOUNTS,
    name: 'Accounts'
  },
  {
    id: OPERATION_NEW_TRANSFER,
    name: 'Create new cash transfer'
  }
];

const WorkingArea = ({selectOperation, currentOperation, ...props}) => {
  return (
    <div className="operations">
      <ul className="operation-chooser">
        { operations.map(operation => (
          <li>
            <button className={'banking-button' + (currentOperation === operation.id ? ' active': '')}
                    onClick={() => selectOperation(operation.id)}>
              {operation.name}
            </button>
          </li>
        )) }
      </ul>
      { currentOperation === OPERATION_ACCOUNTS && <Accounts /> }
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
