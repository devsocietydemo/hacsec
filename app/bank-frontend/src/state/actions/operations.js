import { getUserAccounts, getAccountTransactions } from '../../api';
import { setAccounts } from './accounts';
import { setCurrentBalance } from './currentBalance';
import { setAccountsForTransfer } from './newTransfer';
import { ERROR_ACCOUNTS_FETCH_FAILED, ERROR_BALANCE_FETCH_FAILED,
  ERROR_NEW_TRANSFER_ACCOUNTS_FETCH_FAILED, setError } from './errors';

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
      return getUserAccounts(currentUserId)
      .then(
        data => dispatch(setAccounts(data.response)),
        error => dispatch(setError(ERROR_ACCOUNTS_FETCH_FAILED, error))
      )
    }

    case OPERATION_CURRENT_BALANCE: {
      const {accountId} = params;
      return getAccountTransactions(accountId)
        .then(
          data => dispatch(setCurrentBalance(accountId, data.response)),
          error => dispatch(setError(ERROR_BALANCE_FETCH_FAILED, error))
        );
    }

    case OPERATION_NEW_TRANSFER: {
      const accountId = params ? params.accountId : null;

      return getUserAccounts(currentUserId)
        .then(
          data => dispatch(setAccountsForTransfer(data.response, accountId || data.response[0].account_id)),
          error => dispatch(setError(ERROR_NEW_TRANSFER_ACCOUNTS_FETCH_FAILED, error))
        );
    }

    default:
      return null;
  }
}
