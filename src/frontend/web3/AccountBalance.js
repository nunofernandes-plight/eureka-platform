import React from 'react';
import styled from 'styled-components';
import {__GRAY_100, __GRAY_200, __THIRD} from '../helpers/colors.js';
import Icon from '../webpack/icons/Icon.js';

const Parent = styled.div`
  display: flex;
  justify-content: center;
`;
const Container = styled.div`
  display: flex;
`;

const ColumnLeft = styled.div`
  display: flex;
  flex-direction: column;
  background: ${__GRAY_100};
  padding: 20px;
  border-bottom-left-radius: 6px;
  border-top-left-radius: 6px;
`;

const ColumnRight = styled.div`
  display: flex;
  flex-direction: column;
  background: ${__GRAY_200};
  padding: 20px;
  border-bottom-right-radius: 6px;
  border-top-right-radius: 6px;
`;

const Address = styled.div``;

const Balance = styled.div``;

const Title = styled.h4`
  margin: 0;
`;

class AccountBalance extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Parent>
        {Array.from(this.props.accounts.keys()).map((address, index) => {
          return (
            <Container key={index}>
              <ColumnLeft>
                <Title>Selected Account</Title>
                <Address>{address}</Address>
              </ColumnLeft>

              <ColumnRight>
                <Title>Current Balance</Title>
                <Balance>
                  {this.props.accounts.get(address)}{' '}
                  <Icon
                    icon={'ethereum'}
                    width={15}
                    height={15}
                    color={__THIRD}
                    bottom={'3'}
                  />
                </Balance>
              </ColumnRight>
            </Container>
          );
        })}
      </Parent>
    );
  }
}

export default AccountBalance;
