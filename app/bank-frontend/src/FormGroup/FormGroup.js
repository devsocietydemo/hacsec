import React from 'react'
import PropTypes from 'prop-types'

import './FormGroup.scss';

const FormGroup = ({label, children, ...props}) => {
  return (
    <label className="form-group" {...props}>
      <span className="form-group-label">{ label }</span>
      <span className="form-group-field">
        {children}
      </span>
    </label>
  )
}

export default FormGroup
