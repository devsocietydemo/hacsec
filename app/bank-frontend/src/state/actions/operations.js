import { getUserAccounts, getAccountTransactions, getAccount } from '../../api';
import { setAccounts } from './accounts';
import { setCurrentBalance } from './currentBalance';
import { setAccountsForTransfer } from './newTransfer';
import { startLoading } from './spinner';
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
  const sessionId = getState().session.sessionId;

  if (!currentUser) {
    dispatch(setOperation(null));
    return;
  }

  const currentUserId = currentUser.id;

  dispatch(setOperation(operation));

  switch (operation) {
    case OPERATION_ACCOUNTS: {
      dispatch(startLoading());
      return getUserAccounts(currentUserId, sessionId)
      .then(
        data => dispatch(setAccounts(data.response)),
        error => dispatch(setError(ERROR_ACCOUNTS_FETCH_FAILED, error))
      )
    }

    case OPERATION_CURRENT_BALANCE: {
      const {accountId} = params;

      dispatch(startLoading());
      return Promise.all([
          getAccountTransactions(accountId),
          getAccount(accountId)
        ])
        .then(
          ([txData, accountData]) => dispatch(setCurrentBalance(accountData.response[0], txData.response)),
          error => dispatch(setError(ERROR_BALANCE_FETCH_FAILED, error))
        );
    }

    case OPERATION_NEW_TRANSFER: {
      const accountId = params ? params.accountId : null;

      dispatch(startLoading());
      return getUserAccounts(currentUserId, sessionId)
        .then(
          data => dispatch(setAccountsForTransfer(data.response, (accountId && accountId.toString()) || data.response[0].account_id)),
          error => dispatch(setError(ERROR_NEW_TRANSFER_ACCOUNTS_FETCH_FAILED, error))
        );
    }

    default:
      return null;
  }
}
