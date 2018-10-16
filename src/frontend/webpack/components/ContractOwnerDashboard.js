import React from 'react';
import styled from 'styled-components';
import {Card} from '../views/Card.js';
import {Row} from '../../helpers/layout.js';
import {InputField} from '../design-components/Inputs.js';
import Icon from '../views/icons/Icon.js';
import {Methods} from './Routers/ContractOwnerMethods.js';
import {__GRAY_200, __GRAY_700, __THIRD} from '../../helpers/colors.js';
import {signUpEditor} from '../../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import Modal from '../design-components/Modal.js';
import 'react-toastify/dist/ReactToastify.css';
import '../design-components/Notification.css';
import {ToastContainer} from 'react-toastify';
import {isGanache} from '../../../helpers/isGanache.mjs';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const MyRow = Row.extend`
  flex-direction: column;
  width: 100%;
  justify-content: center;
  margin: 20px 0;
`;

const Title = styled.h3`
  text-transform: uppercase;
`;

const Fields = styled.div`
  display: flex;
`;

const Button = styled.button`
  padding: 15px 30px;
  margin-top: 0;
  margin-bottom: 0;
`;

const ContactUs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
`;

const IconContainer = styled.div`
  &:hover {
    color: white;
    background: ${__THIRD};
    cursor: pointer;
  }
  transition: 0.3s all;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  border: 1px solid ${__GRAY_200};
`;

const Note = styled.p`
  font-size: 10.5px;
  color: ${__GRAY_700};
  margin-top: -5px;
  width: ${props => props.width};
`;
const Text = styled.div`
  font-size: 10px;
`;
class ContractOwnerDashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      mintingAddress: null,
      editorAddress: null,
      errorMessage: null,
      tx: null
    };
  }

  action(stateKey) {
    switch (stateKey) {
      case 'mintingAddress':
        break;

      case 'editorAddress':
        this.assignEditor();
        break;
      default:
        break;
    }
  }

  async assignEditor() {
    let gasAmount;
    // gas estimation on ganache doesn't work properly
    if (!isGanache(this.props.web3))
      gasAmount = await signUpEditor(
        this.props.platformContract,
        this.state.editorAddress
      ).estimateGas({
        from: this.props.selectedAccount.address
      });
    else gasAmount = 80000000;

    await signUpEditor(this.props.platformContract, this.state.editorAddress)
      .send({
        from: this.props.selectedAccount.address,
        gas: gasAmount
      })
      .on('transactionHash', tx => {
        this.setState({tx});
      })
      .on('receipt', receipt => {
        return receipt;
      })
      .on('confirmationNr', res => {
        // toast(
        //   'We got your request in our Smart Contract. You can track the transaction at the following tx hash: ' +
        //     tx,
        //   {
        //     position: toast.POSITION.TOP_CENTER,
        //     autoClose: 20000,
        //     className: '__ALERT_SUCCESS',
        //     progressClassName: '__BAR'
        //   }
        // );
      })
      .catch(err => {
        console.error('submitArticle error: ', err);
        this.setState({
          errorMessage:
            'Ouh. Something went wrong with the Smart Contract call: ' +
            err.toString()
        });
      });
  }

  handleInput(stateKey, e) {
    this.setState({[stateKey]: e.target.value});
  }

  isValid(stateKey) {
    if (!this.state[stateKey]) {
      return null;
    }
    if (this.props.web3.utils.isAddress(this.state[stateKey])) {
      return 'valid';
    } else {
      return 'error';
    }
  }

  renderModals() {
    return (
      <div>
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

        <Modal
          toggle={isTx => {
            this.setState({tx: null});
          }}
          show={this.state.tx}
          title={'We got your request!'}
        >
          Dear Smart Contract Owner, we got your request. You can track your its
          status at the following link:
          <a href={'asfoaosjf'}>{this.state.tx}</a>
          <br />
          We will inform your once your transaction has been successfully mined
          and accepted into a block.
        </Modal>
      </div>
    );
  }
  render() {
    return (
      <Container>
        {' '}
        <ToastContainer />
        {this.renderModals()}
        <Card
          style={{padding: '50px'}}
          width={1000}
          title={'Contract Owner Dashboard'}
        >
          {Methods.map((item, index) => {
            return (
              <MyRow key={index}>
                <Title>{item.title}</Title>
                <Note width={'70%'}>{item.note}</Note>
                <Fields>
                  {item.placeholder ? (
                    <InputField
                      width={'70%'}
                      right={15}
                      placeholder={item.placeholder}
                      status={this.isValid(item.stateKey)}
                      onChange={e => this.handleInput(item.stateKey, e)}
                    />
                  ) : null}
                  <Button
                    onClick={() => {
                      this.action(item.stateKey);
                    }}
                  >
                    {item.buttonText}
                  </Button>
                  <ContactUs>
                    <IconContainer>
                      <Text>See function</Text>
                      <Icon
                        noMove
                        icon={'material'}
                        material={'visibility'}
                        width={15}
                        height={15}
                        left={5}
                      />
                    </IconContainer>
                  </ContactUs>
                </Fields>
              </MyRow>
            );
          })}
        </Card>
      </Container>
    );
  }
}

export default ContractOwnerDashboard;
