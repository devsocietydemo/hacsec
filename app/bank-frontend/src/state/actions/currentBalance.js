export const SET_CURRENT_BALANCE = 'setCurrentBalance';

export const setCurrentBalance = (accountId, transactions) => ({
  type: SET_CURRENT_BALANCE,
  accountId,
  transactions
});
