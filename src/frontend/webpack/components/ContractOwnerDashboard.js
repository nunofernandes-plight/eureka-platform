import React from 'react';
import styled from 'styled-components';
import {Card} from '../views/Card.js';
import {Row} from '../../helpers/layout.js';
import {InputField} from '../design-components/Inputs.js';
import Icon from '../views/icons/Icon.js';
import {Methods} from './routers/ContractOwnerMethods.js';
import {__GRAY_200, __THIRD} from '../../helpers/colors.js';

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
  margin: 0 15px;
  padding: 15px 30px;
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

const Text = styled.div`
  font-size: 10px;
`;
class ContractOwnerDashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      mintingAddress: null,
      editorAddress: null
    };
  }

  action(stateKey) {}

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

  render() {
    return (
      <Container>
        <Card width={1000} title={'Contract Owner Dashboard'}>
          {Methods.map((item, index) => {
            return (
              <MyRow key={index}>
                <Title>{item.title}</Title>
                <Fields>
                  <InputField
                    width={'70%'}
                    placeholder={item.placeholder}
                    status={this.isValid(item.stateKey)}
                    onChange={e => this.handleInput(item.stateKey, e)}
                  />
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
