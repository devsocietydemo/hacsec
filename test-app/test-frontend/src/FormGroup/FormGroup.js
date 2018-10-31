import React from 'react'

import './FormGroup.scss';

const FormGroup = ({label, children, noHtmlLabel, ...props}) => {

  const ElementType = noHtmlLabel ? 'div' : 'label';
  return (
    <ElementType className="form-group" {...props}>
      <span className="form-group-label">{ label }</span>
      <span className="form-group-field">
        {children}
      </span>
    </ElementType>
  )
}

export default FormGroup
