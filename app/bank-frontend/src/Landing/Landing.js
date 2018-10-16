import React from 'react'
import PropTypes from 'prop-types'

import './Landing.scss';

const Landing = ({children, ...props}) => {
  return (
    <div className="landing" {...props}>
      <h1>Experience the safe banking.</h1>

      <div className="landing-overlay">

        <p>The internet Banking of <strong className="color-brand">acmeBank</strong> provides You not only the best possible savings. We do have modern and safe internet banking. Right here for You.</p>
        <h2 className="color-brand">Try out now and login to the account.</h2>

      </div>

      {children}
    </div>
  )
}

export default Landing
