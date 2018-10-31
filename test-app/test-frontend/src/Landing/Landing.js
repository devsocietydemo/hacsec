import React from 'react'
import { connect } from 'react-redux';

import './Landing.scss';
import { init } from '../state/actions/session';

class Landing extends React.Component {

  render() {
    const { init, ...props} = this.props;
    return (
      <div className="landing" {...props}>
        <h1>Generate unique access key.</h1>
  
        <div className="landing-overlay">
  
          <p>This application is used to test your system compatibility and generate unique user access key, necessary to participate in hackathon event.</p>
          <h2 className="color-brand">Provide your e-mail address and your workstation hostname to generate key</h2>
  
        </div>
  
        {this.props.children}
      </div>
    )
  }

  componentDidMount() {
    const { init } = this.props;
    init();
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(init()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
