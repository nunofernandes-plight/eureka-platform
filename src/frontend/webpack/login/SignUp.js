import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Row} from '../../helpers/layout.js';
import MetaMaskLogo from '../icons/MetaMaskLogo.js';
import EurekaLogo from '../icons/EurekaLogo.js';
import Web3Providers from '../../web3/Web3Providers.js';
import {MetaMaskStatus} from '../../web3/MetaMaskStatus.js';
import Modal from '../design-components/Modal.js';
import AccountBalance from '../../web3/AccountBalance.js';
import {isEmailValid} from '../../../helpers/emailValidator.js';
import {InputField} from '../design-components/Inputs.js';
import Alert from '../design-components/Alerts.js';
import EurekaSpinner from '../../webpack/spinners/EurekaSpinner.js';
import {getDomain} from '../../../helpers/getDomain.js';
import {
  Container,
  AlertContainer,
  Paragraph,
  SubTitle,
  Title,
  AlertDevContainer,
  Button,
  ButtonRow,
  LoginContainer,
  LoginRow,
  TitleRow
} from './SharedForms.js';

class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      username: null,
      email: null,
      isShowed: false,
      defaultAccount: null,
      signedKey: null,
      inputStatus: null,
      isEmailValidModal: false,
      submitted: false,
      errorMessage: null,
      loading: false
    };
  }

  async register(props) {
    this.setState({submitted: true});

    if (!isEmailValid(this.state.email)) {
      this.setState({isEmailValidModal: true});
      return;
    }

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
    const signedKey = await this.signPrivateKey();
    this.setState({signedKey});

    if (signedKey) {
      this.setState({loading: true});
      fetch(`${getDomain()}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.signedKey,
          ethereumAddress: this.state.defaultAccount
        })
      })
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            this.props.setAuth(true);
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

  signPrivateKey() {
    const accounts = Array.from(this.props.accounts.keys());
    let defaultAccount;
    if (accounts.length === 1) {
      defaultAccount = accounts[0];
    } else {
      // TODO: handle GANACHE case
      defaultAccount = accounts[0];
    }
    if (defaultAccount) {
      this.setState({defaultAccount});
    }

    const message =
      'EUREKA Register Authentication for the email: ' +
      this.state.email +
      '  - Please click to the Sign Button below.';

    if (this.props.provider === Web3Providers.LOCALHOST) {
      // FAKE PASSWORD FOR DEV
      return '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c';
    } else if (this.props.provider === Web3Providers.META_MASK) {
      if (this.props.web3.utils.isAddress(defaultAccount)) {
        return this.props.web3.eth.personal
          .sign(message, defaultAccount)
          .then(signedKey => {
            return signedKey;
          })
          .catch(err => console.log(err));
      }
    }
  }

  handleInput(stateKey, e) {
    if (isEmailValid(e.target.value)) {
      this.setState({inputStatus: 'valid'});
    } else {
      this.setState({inputStatus: 'error'});
    }
    this.setState({[stateKey]: e.target.value});
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
                <TitleRow>
                  <Title>
                    Welcome to{' '}
                    <div style={{marginLeft: 10}}>
                      <EurekaLogo blueNoLogo width={200} />
                    </div>
                  </Title>
                  {this.props.provider === Web3Providers.META_MASK ? (
                    <AlertContainer>
                      <Alert status={'info'}>
                        We detected MetaMask in your Browser! We use it as our
                        authentication provider. Please note that we are not
                        able neither to see nor to store your private keys.{' '}
                      </Alert>
                    </AlertContainer>
                  ) : null}
                  {this.props.provider === Web3Providers.LOCALHOST ? (
                    <AlertDevContainer>
                      <Alert status={'warning'}>
                        THIS IS A DEV ENVIRONMENT
                      </Alert>
                    </AlertDevContainer>
                  ) : null}
                </TitleRow>

                <Row>
                  <LoginContainer provider={this.props.provider}>
                    <SubTitle>Please Register</SubTitle>
                    <LoginRow>
                      <InputField
                        placeholder={'email address'}
                        status={
                          this.state.email ? this.state.inputStatus : null
                        }
                        onChange={e => this.handleInput('email', e)}
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            this.register(this.props);
                          }
                        }}
                      />
                    </LoginRow>

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
                        Register with Metamask{' '}
                        <MetaMaskLogo width={20} height={20} />
                      </Button>
                    </ButtonRow>
                  </LoginContainer>
                </Row>
                <Row>
                  <Paragraph>
                    Already have an <strong>account</strong>? Please{' '}
                    <Link to="/login">log in here.</Link>
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

export default SignUp;
