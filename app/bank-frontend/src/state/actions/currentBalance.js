export const SET_CURRENT_BALANCE = 'setCurrentBalance';

export const setCurrentBalance = (account, transactions) => ({
  type: SET_CURRENT_BALANCE,
  account,
  transactions
});
