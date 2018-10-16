import React from 'react'
import PropTypes from 'prop-types'

import './TransferOption.scss';

const TransferOption = ({label, icon: Icon}) => {
  return (
    <div className="transfer-option">
      <div className="transfer-option-icon">
        <Icon />
      </div>

      <div className="transfer-option-label">
        { label }
      </div>
    </div>
  )
}

export default TransferOption;
