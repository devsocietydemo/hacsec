import {OPERATION_ACCOUNTS, selectOperation} from './operations';
import { setError, ERROR_TRANSFER_FAILED } from './errors';
import { startLoading } from './spinner';
import { sendNormalTransfer } from '../../api';

export const SET_ACCOUNTS_FOR_TRANSFER = 'setAccountsForTransfer';
export const SET_INPUT_TRANSFER_DATA = 'setInputTransferData';
export const SET_TRANSFER_ERROR = 'setTransferError';

export const setAccountsForTransfer = (accounts, senderBankAccount) => ({
  type: SET_ACCOUNTS_FOR_TRANSFER,
  accounts,
  senderBankAccount
});

export const setInputTransferData = (field, value) => ({
  type: SET_INPUT_TRANSFER_DATA,
  values: {
    [field]: value
  }
});

export const setTransferError = (error) => ({
  type: SET_TRANSFER_ERROR,
  error
});

export const initTransferSend = () => (dispatch, getState) => {
  const {
    targetBankAccountNumber: target_iban,
    amount,
    description,
    senderBankAccount: account_id
  } = getState().newTransfer;

  const dataToSend = {
    target_iban,
    amount,
    description,
    account_id
  };

  dispatch(startLoading());
  return sendNormalTransfer(dataToSend)
    .then(
      () => dispatch(selectOperation(OPERATION_ACCOUNTS)),
      error => dispatch(setError(ERROR_TRANSFER_FAILED, error.message))
    );
}
