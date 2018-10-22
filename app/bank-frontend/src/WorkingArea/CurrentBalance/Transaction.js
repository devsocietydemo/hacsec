import React from 'react'

const Transaction = ({
  amount,
  description,
  id,
  target_iban,
  transaction_date
}) => {
  return (
    <div className="transaction">
      <span className="transaction-date">{ transaction_date }</span>
      <span className="transaction-details">

        <span className="transaction-details-description">
          { description }
        </span>
        <span className="transaction-details-iban">
          For: <strong>{ target_iban }</strong>
        </span>
      </span>
      <span className="transaction-amount">{ amount }</span>
    </div>
  )
}

export default Transaction
