export const SET_ACCOUNTS_FOR_TRANSFER = 'setAccountsForTransfer';
export const SET_INPUT_TRANSFER_DATA = 'setInputTransferData';

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
