import { getUserAccounts, getTransaction } from '../../api';
import { setAccounts } from './accounts';

export const SET_OPERATION = 'setOperation';
export const SET_INPUT_CREDENTIALS = 'setInputCredentials';

export const OPERATION_ACCOUNTS = 'accounts';
export const OPERATION_NEW_TRANSFER = 'newTransfer';
export const OPERATION_CURRENT_BALANCE = 'currentBalance';

export const setOperation = (operation) => ({
  type: SET_OPERATION,
  operation
});

export const selectOperation = (operation) => (dispatch, getState) => {
  const currentUserId = getState().session.currentUser.id;

  switch (operation) {
    case OPERATION_ACCOUNTS:
      getUserAccounts(currentUserId).then(data => {
        dispatch(setAccounts(data.response));
        dispatch(setOperation(OPERATION_ACCOUNTS));
      })
  }
}
