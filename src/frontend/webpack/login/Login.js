import React, {Component} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {Row} from '../../helpers/layout.js';
import {
  __ALERT_ERROR,
  __ALERT_WARNING,
  __FOURTH,
  __SECOND,
  __THIRD
} from '../../helpers/colors.js';
import MetaMaskLogo from '../icons/MetaMaskLogo.js';
import EurekaLogo from '../icons/EurekaLogo.js';
import Web3Providers from '../../web3/Web3Providers.js';
import {MetaMaskStatus} from '../../web3/MetaMaskStatus.js';
import Modal from '../../design-components/Modal.js';
import AccountBalance from '../../web3/AccountBalance.js';
import {isEmailValid} from '../../../helpers/emailValidator.js';
import {InputField} from '../../design-components/Inputs.js';
import {Alert} from '../../design-components/Alerts.js';

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
  opacity: ${props => (props.provider === Web3Providers.META_MASK ? 1 : 0.1)};
  pointer-events: ${props =>
    props.provider === Web3Providers.META_MASK ? null : 'none'};
`;

const Button = styled.button`
  background: -webkit-linear-gradient(0deg, ${__THIRD} 0%, ${__FOURTH} 100%);
  align-self: center;
`;

const MetaMaskDisclaimer = styled.div``;

const Paragraph = styled.p`
  word-break: break-word;
  text-align: center;
  width: 700px;
  margin-bottom: 40px;
  background: ${__SECOND};
  border-radius: 10px;
  color: white;
  padding: 20px;
  box-shadow: 0 2.213px 15px 0px rgb(51, 46, 46);
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

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.05;
  filter: alpha(opacity=0.05); /* For IE8 and earlier */
`;

const MetaMaskInstalled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background: ${__ALERT_WARNING};
  font-size: 13px;
  max-width: 900px;
  color: white;
  border-radius: 4px;
  margin-top: 4em;
`;

const SubTitle = styled.h2`
  text-align: center;
`;

const EmailInput = styled.input`
  border: ${__ALERT_ERROR};
`;
class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: null,
      email: null,
      isShowed: false,
      signedKey: null,
      inputStatus: null,
      isEmailValidModal: false,
      submitted: false
    };
  }

  async login(props) {
    this.setState({submitted: true});
    const status = props.metaMaskStatus;
    if (
      status === MetaMaskStatus.DETECTED_NO_LOGGED_IN ||
      status === MetaMaskStatus.NO_DETECTED
    ) {
      this.setState({isShowed: true});
    }

    if (!isEmailValid(this.state.email)) {
      this.setState({isEmailValidModal: true});
    }

    if (status === MetaMaskStatus.DETECTED_LOGGED_IN) {
      // already logged in
      const accounts = Array.from(this.props.accounts.keys());
      let defaultAccount;
      if (accounts.length === 1) {
        defaultAccount = accounts[0];
      } else {
        // TODO: handle GANACHE case
      }
      this.props.web3.eth.personal
        .sign(
          'EUREKA Login Authentication for the email: ' +
            this.state.email +
            '  - Please click to the Sign Button below.',
          defaultAccount
        )
        .then(signedKey => {
          this.setState({signedKey});
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

  render() {
    return (
      <div>
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
          toggle={isEmailValidModal => {
            this.setState({isEmailValidModal});
          }}
          show={this.state.isEmailValidModal && this.state.submitted}
          title={'Inserted Email is invalid'}
        >
          Ouh. The email {this.state.email} does not seem to be a valid email.
          Please insert a correct one.
        </Modal>

        <Container>
          {this.props.provider !== Web3Providers.META_MASK ? (
            <MetaMaskInstalled>
              <p>
                Ouh! We were not able to detect MetaMask in your browser. Please
                follow the instruction{' '}
                <strong>
                  <Link to="/metamask"> here </Link>
                </strong>{' '}
                of how to download it.
              </p>
            </MetaMaskInstalled>
          ) : null}
          <TitleRow>
            <Title>
              Welcome to{' '}
              <div style={{marginLeft: 10}}>
                <EurekaLogo blueNoLogo width={200} />
              </div>
            </Title>
            {this.props.provider === Web3Providers.META_MASK ? (
              <Alert status={'warning'}>Lalallaallalaalal</Alert>
            ) : null}
          </TitleRow>

          <Row>
            <LoginContainer provider={this.props.provider}>
              <SubTitle>Please login</SubTitle>
              <LoginRow>
                <InputField
                  placeholder={'email address'}
                  status={this.state.email ? this.state.inputStatus : null}
                  onChange={e => this.handleInput('email', e)}
                />
              </LoginRow>

              {this.props.metaMaskStatus ===
                MetaMaskStatus.DETECTED_LOGGED_IN && this.props.accounts ? (
                <LoginRow>
                  <AccountBalance accounts={this.props.accounts} balance={0} />
                </LoginRow>
              ) : null}
              <ButtonRow>
                <Button
                  onClick={() => {
                    this.login(this.props);
                  }}
                >
                  Login with Metamask <MetaMaskLogo width={20} height={20} />
                </Button>
              </ButtonRow>
              {/*<Background>*/}
              {/*<EurekaLogo width={400} height={400} />*/}
              {/*</Background>*/}
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
    );
  }
}

export default Login;
