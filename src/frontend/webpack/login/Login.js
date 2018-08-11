import React, {Component} from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import {Row} from '../../helpers/layout.js';
import MetaMaskLogo from '../icons/MetaMaskLogo.js';
import {signPrivateKey} from '../../web3/Helpers.js';
import Web3Providers from '../../web3/Web3Providers.js';
import {MetaMaskStatus} from '../../web3/MetaMaskStatus.js';
import Modal from '../design-components/Modal.js';
import AccountBalance from '../../web3/AccountBalance.js';
import EurekaSpinner from '../../webpack/spinners/EurekaSpinner.js';
import {getDomain} from '../../../helpers/getDomain.js';
import {
  Container,
  Paragraph,
  SubTitle,
  Button,
  ButtonRow,
  LoginContainer,
  LoginRow
} from './SharedForms.js';
import TopAlertContainer from './TopAlertContainer.js';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      isShowed: false,
      signature: null,
      isEmailValidModal: false,
      submitted: false,
      errorMessage: null,
      loading: false
    };
  }

  async register(props) {
    this.setState({submitted: true});

    // DEV ENVIRONMENT
    if (props.provider === Web3Providers.LOCALHOST) {
      this.apiCall();
    } else if (props.provider === Web3Providers.META_MASK) {
      const status = props.metaMaskStatus;
      if (
        status === MetaMaskStatus.DETECTED_NO_LOGGED_IN ||
        status === MetaMaskStatus.NO_DETECTED
      ) {
        this.setState({isShowed: true});
        return;
      }

      if (status === MetaMaskStatus.DETECTED_LOGGED_IN) {
        // already logged in
        this.apiCall();
      }
    }
  }

  async apiCall() {
    const signature = await this.signPrivateKey();
    this.setState({signature});

    if (signature) {
      this.setState({loading: true});
      fetch(`${getDomain()}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          password: this.state.signature,
          ethereumAddress: this.props.selectedAccount.address
        })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.props.history.push('/app');
          } else {
            this.setState({
              errorMessage: response.error,
              loading: false
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({
            errorMessage: 'Ouh. Something went wrong.',
            loading: false
          });
        });
    }
  }

  async signPrivateKey() {
    const message =
      'EUREKA Register Authentication for the email: ' +
      this.state.email +
      '  - Please click to the Sign Button below.';

    if (this.props.provider === Web3Providers.LOCALHOST) {
      // FAKE PASSWORD FOR DEV
      return '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c';
    } else if (this.props.provider === Web3Providers.META_MASK) {
      return signPrivateKey(
        this.props.web3,
        this.props.selectedAccount.address,
        message
      );
    }
  }

  renderModals() {
    return (
      <div>
        {' '}
        <Modal
          toggle={isShowed => {
            this.setState({isShowed});
          }}
          show={
            this.state.isShowed &&
            this.props.metaMaskStatus !== MetaMaskStatus.DETECTED_LOGGED_IN
          }
          title={'Register using MetaMask - INFORMATION'}
        >
          Please be sure to have MetaMask<MetaMaskLogo width={15} height={15} />{' '}
          installed in your browser! If you already have installed it, open the
          Extension and log in into your account please!{' '}
          <strong>Remember: </strong> we can neither see nor store your private
          keys.
        </Modal>
        <Modal
          type={'notification'}
          toggle={isEmailValidModal => {
            this.setState({isEmailValidModal});
          }}
          show={this.state.isEmailValidModal && this.state.submitted}
          title={'Inserted Email is invalid'}
        >
          Ouh. The email {this.state.email} does not seem to be a valid email.
          Please insert a correct one.
        </Modal>
        <Modal
          type={'notification'}
          toggle={isErrorMessage => {
            this.setState({errorMessage: null});
          }}
          show={this.state.errorMessage}
          title={'You got the following error'}
        >
          {this.state.errorMessage}
        </Modal>
      </div>
    );
  }
  render() {
    return (
      <div>
        {this.props.authed ? <Redirect to={'/dashboard'} /> : null}
        <div>
          {this.state.loading ? (
            <EurekaSpinner />
          ) : (
            <div>
              {this.renderModals()}
              <Container>
                <TopAlertContainer provider={this.props.provider} />

                <Row>
                  <LoginContainer provider={this.props.provider}>
                    <SubTitle>Please Login</SubTitle>

                    {this.props.accounts ? (
                      <LoginRow>
                        <AccountBalance
                          accounts={this.props.accounts}
                          provider={this.props.provider}
                          selectedAccount={this.props.selectedAccount}
                          changeAccount={selectedAccount => {
                            this.props.changeAccount(selectedAccount);
                          }}
                        />
                      </LoginRow>
                    ) : null}
                    <ButtonRow>
                      <Button
                        onClick={() => {
                          this.register(this.props);
                        }}
                      >
                        Login with Metamask{' '}
                        <MetaMaskLogo width={20} height={20} />
                      </Button>
                    </ButtonRow>
                  </LoginContainer>
                </Row>
                <Row>
                  <Paragraph>
                    Don't have an <strong>account</strong>? Please{' '}
                    <Link to="/signup">sign up here.</Link>
                  </Paragraph>
                </Row>
              </Container>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
