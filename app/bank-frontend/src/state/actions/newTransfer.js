import { stateToHTML } from 'draft-js-export-html';

import { OPERATION_ACCOUNTS, selectOperation } from './operations';
import { setError, ERROR_TRANSFER_FAILED } from './errors';
import { startLoading } from './spinner';
import { sendNormalTransfer } from '../../api';

export const SET_ACCOUNTS_FOR_TRANSFER = 'setAccountsForTransfer';
export const SET_INPUT_TRANSFER_DATA = 'setInputTransferData';
export const SET_TRANSFER_ERROR = 'setTransferError';
export const SET_DESCRIPTION_MODE = 'setDescriptionMode';

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

export const setDescriptionMode = (mode) => ({
  type: SET_DESCRIPTION_MODE,
  mode
});

export const initTransferSend = () => (dispatch, getState) => {
  const {
    targetBankAccountNumber: target_iban,
    amount,
    description,
    descriptionHtml,
    senderBankAccount: account_id,
    descriptionMode
  } = getState().newTransfer;

  const dataToSend = {
    target_iban,
    amount,
    description: descriptionMode === 'visual'
      ? stateToHTML(description.getCurrentContent()) : descriptionHtml,
    account_id
  };

  dispatch(startLoading());
  return sendNormalTransfer(dataToSend)
    .then(
      () => dispatch(selectOperation(OPERATION_ACCOUNTS)),
      error => dispatch(setError(ERROR_TRANSFER_FAILED, error.message))
    );
}
