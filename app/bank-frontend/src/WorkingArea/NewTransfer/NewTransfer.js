import React from 'react'
import PropTypes from 'prop-types'

import FormGroup from './FormGroup';

const NewTransfer = (props) => {
  return (
    <div>
      <form>
        <FormGroup label="From account">
          <input type="text" disabled />
        </FormGroup>

        <FormGroup label="To account">
          <input type="text" />
        </FormGroup>

        <FormGroup label="Amount">
          <input type="text" />
        </FormGroup>
      </form>
    </div>
  )
}

export default NewTransfer
