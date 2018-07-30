import React, {Component} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {Row} from '../../helpers/layout.js';
import {
  __ALERT_WARNING,
  __FOURTH,
  __SECOND,
  __THIRD
} from '../../helpers/colors.js';
import MetaMaskLogo from '../icons/MetaMaskLogo.js';
import EurekaLogo from '../icons/EurekaLogo.js';
import Web3Providers from '../../web3/Web3Providers.js';
import {getMetaMaskStatus} from '../../web3/IsLoggedIn.js';
import {MetaMaskStatus} from '../../web3/MetaMaskStatus.js';

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
  width: 600px;
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
class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: null,
      email: null,
      metaMaskStatus: null,
      metaMaskPopup: false
    };
  }

  async componentDidMount() {
    const metaMaskStatus = await getMetaMaskStatus(this.props.web3);
    this.setState({metaMaskStatus});
  }

  async login() {
    //web3.eth.sign('Hello world', '0x6FF530adA03d01361e08c82f86B9E5114B1E5c4c');
    //await web3.eth.getAccounts()
    //web3.eth.personal.sign("0x6FF530adA03d01361e08c82f86B9E5114B1E5c4c", "0x6FF530adA03d01361e08c82f86B9E5114B1E5c4c")
  }

  handleInput(stateKey, e) {
    this.setState({[stateKey]: e.target.value});
  }

  render() {
    return (
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
            <MetaMaskDisclaimer>
              <Paragraph>
                We detected MetaMask<MetaMaskLogo width={15} height={15} />in
                your Browser! We use it as our authentication provider. Please
                note that we are not able neither to see nor to store your
                private keys.{' '}
              </Paragraph>
            </MetaMaskDisclaimer>
          ) : null}
        </TitleRow>

        <Row>
          <LoginContainer provider={this.props.provider}>
            <SubTitle>Please login</SubTitle>
            <LoginRow>
              <input
                onChange={e => this.handleInput('username', e)}
                type="text"
                required
              />
              <label>Username</label>
            </LoginRow>
            <LoginRow>
              <input
                onChange={e => this.handleInput('email', e)}
                type="text"
                required
              />
              <label>Email address</label>
            </LoginRow>
            <ButtonRow>
              <Button
                onClick={() => {
                  this.login();
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
    );
  }
}

export default Login;
