import React from 'react'

import { MdCompareArrows } from 'react-icons/md';

import FormattedCashAmount from '../../FormattedCashAmount/FormattedCashAmount';

const Transaction = ({
  amount,
  description,
  id,
  target_iban,
  transaction_date,
  currency
}) => {
  return (
    <div className="transaction">
      <span className="transaction-icon">
        <MdCompareArrows />
      </span>
      <span className="transaction-date">{ transaction_date }</span>
      <span className="transaction-details">
        <span className="transaction-details-description">
          { description }
        </span>
        <span className="transaction-details-iban">
          For: <strong>{ target_iban }</strong>
        </span>
      </span>
      <span className="transaction-amount">
        <FormattedCashAmount amount={amount}
                             currency={currency} />
      </span>
    </div>
  )
}

export default Transaction
