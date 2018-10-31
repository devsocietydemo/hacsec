import React from 'react'
import { connect } from 'react-redux';

import './Spinner.scss';

const Spinner = ({spinning}) => {
  return (
    <div className={'spinner' + (spinning ? ' spinner-visible' : '')}>
      <div className="sk-cube-grid">
        <div className="sk-cube sk-cube1"></div>
        <div className="sk-cube sk-cube2"></div>
        <div className="sk-cube sk-cube3"></div>
        <div className="sk-cube sk-cube4"></div>
        <div className="sk-cube sk-cube5"></div>
        <div className="sk-cube sk-cube6"></div>
        <div className="sk-cube sk-cube7"></div>
        <div className="sk-cube sk-cube8"></div>
        <div className="sk-cube sk-cube9"></div>
      </div>
    </div>
  )
}


const mapStateToProps = state => ({
  spinning: state.spinner.spinning
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Spinner);
