import { getUserAccounts, getTransaction, getAccountTransactions } from '../../api';
import { setAccounts } from './accounts';
import { setCurrentBalance } from './currentBalance';

export const SET_OPERATION = 'setOperation';
export const SET_INPUT_CREDENTIALS = 'setInputCredentials';

export const OPERATION_ACCOUNTS = 'accounts';
export const OPERATION_NEW_TRANSFER = 'newTransfer';
export const OPERATION_CURRENT_BALANCE = 'currentBalance';

export const setOperation = (operation, params) => ({
  type: SET_OPERATION,
  operation,
  params
});

export const selectOperation = (operation, ...params) => (dispatch, getState) => {
  const currentUserId = getState().session.currentUser.id;

  dispatch(setOperation(operation));

  switch (operation) {
    case OPERATION_ACCOUNTS:
      getUserAccounts(currentUserId).then(data => {
        dispatch(setAccounts(data.response));
      });
      break;

    case OPERATION_CURRENT_BALANCE:
      const [accountId] = params;
      getAccountTransactions(accountId).then(data => {
        dispatch(setCurrentBalance(accountId, data.response));
      })
  }
}
