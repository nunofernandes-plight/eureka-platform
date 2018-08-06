import React, {Component} from 'react';
import styled from 'styled-components';
import {Link, Redirect} from 'react-router-dom';
import {Row} from '../../helpers/layout.js';
import {__ALERT_WARNING, __FOURTH, __THIRD} from '../../helpers/colors.js';
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

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
`;
const Title = styled.h1`
  color: ${__THIRD};
  margin-top: 1.5em;
  text-align: center;
  display: flex;
  justify-content: center;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 5px;
  width: 450px;
  position: relative;
`;

const Button = styled.button`
  background: -webkit-linear-gradient(0deg, ${__THIRD} 0%, ${__FOURTH} 100%);
  align-self: center;
`;

const AlertContainer = styled.div`
  word-break: break-word;
  width: 700px;
  margin-bottom: 40px;
`;

const TitleRow = Row.extend`
  flex-direction: column;
`;
const LoginRow = styled.div`
  margin: 10px 0;
`;

const ButtonRow = styled.div`
  align-self: center;
  margin: 15px 0;
`;

const SignUp = styled.p``;

const AlertDevContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  max-width: 900px;
  color: white;
  border-radius: 4px;
`;

const SubTitle = styled.h2`
  text-align: center;
`;

class Login extends Component {
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
      loading: false,
      authenticated: false
    };
  }

  async login(props) {
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
        mode: 'cors',
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
          this.setState({
            errorMessage: err,
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
      'EUREKA Login Authentication for the email: ' +
      this.state.email +
      '  - Please click to the Sign Button below.';

    if (this.props.provider === Web3Providers.LOCALHOST) {
      // FAKE PASSWORD FOR DEV
      return '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c';
    } else if (this.props.provider === Web3Providers.META_MASK) {
      return this.props.web3.eth.personal
        .sign(message, defaultAccount)
        .then(signedKey => {
          return signedKey;
        })
        .catch(err => console.log(err));
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
          title={'Login using MetaMask - INFORMATION'}
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
                    <SubTitle>Please login</SubTitle>
                    <LoginRow>
                      <InputField
                        placeholder={'email address'}
                        status={
                          this.state.email ? this.state.inputStatus : null
                        }
                        onChange={e => this.handleInput('email', e)}
                      />
                    </LoginRow>

                    {this.props.metaMaskStatus ===
                      MetaMaskStatus.DETECTED_LOGGED_IN &&
                    this.props.accounts ? (
                      <LoginRow>
                        <AccountBalance
                          accounts={this.props.accounts}
                          balance={0}
                        />
                      </LoginRow>
                    ) : null}
                    <ButtonRow>
                      <Button
                        onClick={() => {
                          this.login(this.props);
                        }}
                      >
                        Login with Metamask{' '}
                        <MetaMaskLogo width={20} height={20} />
                      </Button>
                    </ButtonRow>
                  </LoginContainer>
                </Row>
                <Row>
                  <SignUp>
                    Do not have <strong>Metamask</strong>? Please{' '}
                    <Link to="/metamask">See here.</Link>
                  </SignUp>
                </Row>
              </Container>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Login;
