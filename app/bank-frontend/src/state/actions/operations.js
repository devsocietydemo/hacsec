import { getUserAccounts, getAccountTransactions } from '../../api';
import { setAccounts } from './accounts';
import { setCurrentBalance } from './currentBalance';
import { setAccountsForTransfer } from './newTransfer';

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

export const selectOperation = (operation, params) => (dispatch, getState) => {
  const currentUser = getState().session.currentUser;

  if (!currentUser) {
    dispatch(setOperation(null));
    return;
  }

  const currentUserId = currentUser.id;

  dispatch(setOperation(operation));

  switch (operation) {
    case OPERATION_ACCOUNTS: {
      return getUserAccounts(currentUserId).then(data => {
        dispatch(setAccounts(data.response));
      });
    }

    case OPERATION_CURRENT_BALANCE: {
      const {accountId} = params;
      return getAccountTransactions(accountId).then(data => {
        dispatch(setCurrentBalance(accountId, data.response));
      })
    }

    case OPERATION_NEW_TRANSFER: {
      const accountId = params ? params.accountId : null;

      return getUserAccounts(currentUserId).then(data => {
        dispatch(setAccountsForTransfer(data.response, accountId));
      })
    }

    default:
      return null;
  }
}
