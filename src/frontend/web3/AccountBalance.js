import React from 'react';
import styled from 'styled-components';
import {__GRAY_100, __GRAY_200, __THIRD} from '../helpers/colors.js';
import Icon from '../webpack/icons/Icon.js';
import Web3Providers from './Web3Providers.js';
import Select from 'react-select';

const Parent = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
const Container = styled.div`
  display: flex;
  margin: 10px 0;
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
  handleChange = selectedAccount => {
    let account = {};
    account.address = selectedAccount.label;
    account.balance = selectedAccount.value;
    this.props.changeAccount(account);
  };

  renderGanacheAccounts() {
    console.log(this.props.selectedAccount);
    const address = this.props.selectedAccount
      ? this.props.selectedAccount.address
      : null;
    const balance = this.props.selectedAccount
      ? this.props.selectedAccount.balance
      : null;
    return (
      <div>
        <Select
          simpleValue
          style={{color: 'inherit'}}
          // value={this.state.selectedAddress}
          onChange={this.handleChange}
          options={Array.from(this.props.accounts.keys()).map(addr => ({
            label: addr,
            value: this.props.accounts.get(addr)
          }))}
        />

        <Container>
          <ColumnLeft>
            <Title />
            <Address>{address}</Address>
          </ColumnLeft>

          <ColumnRight>
            <Title>Balance</Title>
            <Balance>
              {balance}
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
      </div>
    );
  }

  renderMetaMaskAccount() {
    return (
      <div>
        {Array.from(this.props.accounts.keys()).map((address, index) => {
          return (
            <Container key={index}>
              <ColumnLeft>
                <Title>Selected Account</Title>
                <Address>{address}</Address>
              </ColumnLeft>

              <ColumnRight>
                <Title>Balance</Title>
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
      </div>
    );
  }
  render() {
    return (
      //  Either Metamask (no in-app addresses switch possible) or Ganache (react select for address selection)
      <Parent>
        {this.props.accounts && this.props.provider === Web3Providers.META_MASK
          ? this.renderMetaMaskAccount()
          : this.renderGanacheAccounts()}
      </Parent>
    );
  }
}

export default AccountBalance;
