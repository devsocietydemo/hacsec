import React from 'react'

const FormattedCashAmount = ({amount, currency}) => {
  return amount ? (
    <span>
    { amount.toLocaleString(undefined, {
      minimumFractionDigits: 2
    }) } {currency}
    </span>
  ) : null
}

export default FormattedCashAmount
