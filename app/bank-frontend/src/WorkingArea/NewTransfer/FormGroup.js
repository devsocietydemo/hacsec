import React from 'react'
import PropTypes from 'prop-types'

const FormGroup = ({label, children, ...props}) => {
  return (
    <label {...props}>
      <span className="group-label">{ label }</span>
      <span className="field">
        {children}
      </span>
    </label>
  )
}

export default FormGroup
