import React from 'react'
import { connect } from 'react-redux';

import './Landing.scss';
import { init } from '../state/actions/session';

class Landing extends React.Component {

  render() {
    const { init, email, hostname, hash, ...props} = this.props;
    return (
      <div className="landing" {...props}>
        <h1>Generate your unique access key</h1>
  
        <div className="landing-overlay">
  
          <p>This application is used to test your system compatibility and generate unique user access key, necessary to participate in hackathon event.</p>
          { !hash && <h2 className="color-brand">Provide your e-mail address and your workstation hostname to generate key</h2> }
          { hash && 
            <div>
              <h2>Your access key is: <strong className="color-brand">{ hash }</strong></h2>
              <a className="test-button active test-button-big link-button" 
                        href={ 'mailto:dawid.buchwald@cgi.com?subject=Hackathon participant confirmation&body=email: ' + email + ', hostname: ' + hostname + ', hash: ' + hash } >
                  Send confirmation e-mail
              </a>
            </div>
          }
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
  email: state.encrypt.email,
  hostname: state.encrypt.hostname,
  hash: state.encrypt.hash
});

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(init()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
