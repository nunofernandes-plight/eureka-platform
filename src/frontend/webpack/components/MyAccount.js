import React, {Component} from 'react';
import styled from 'styled-components';
import {Row} from '../../helpers/layout.js';
import {__ALERT_ERROR, __GRAY_200, __THIRD} from '../../helpers/colors.js';
import EurekaLogo from '../views/icons/EurekaLogo.js';
import Icon from '../views/icons/Icon.js';
import CircleSpinner from '../views/spinners/CircleSpinner.js';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardContainer = Row.extend`
  transition: all 0.15s ease;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  border: 0.0625rem solid rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
  background-color: #ffffff;
  background-clip: border-box;
  min-height: 420px;
  min-width: 800px;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07) !important;
`;

const PhotoContainer = styled.div`
  &:hover {
    opacity: 0.4;
  }
  position: relative;
  transition: all 0.15s ease;
`;

const Photo = styled.img`
  position: absolute;
  left: 50%;
  max-width: 180px;
  transition: all 0.15s ease;
  transform: translate(-50%, -30%);
  border-radius: 0.25rem;
`;

const Email = styled.div`
  font-family: inherit;
  font-weight: 400;
  line-height: 1.3;
  font-size: 1.75rem;
  color: ${__THIRD};
`;

const ProfileRow = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 0;
`;

const EmailContainer = ProfileRow.extend`
  margin-top: 9rem;
`;

const EthereumAddress = styled.div`
  color: ${__THIRD};
  font-weight: 300 !important;
  font-size: 1rem;
`;

const Separator = styled.div`
  height: 1px;
  width: 80%;
  background: ${__GRAY_200};
  margin: 10px 0;
`;

const Balances = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
`;

const Balance = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
`;

const SubTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 5px;
  color: ${__ALERT_ERROR};
  text-align: center;
`;
const Number = styled.div`
  margin-left: 5px;
`;

const SeeHistory = styled.div`
  font-size: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
`;

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\'');
};

class MyAccount extends Component {
  componentDidMount() {
    this.props.updateAccount();
  }

  render() {
    return (
      <Container>
        <CardContainer>
          <Card>
            <PhotoContainer>
              <Photo src={'/' + this.props.user.avatar}/>
            </PhotoContainer>
            <EmailContainer>
              <Email>{this.props.user.email}</Email>
            </EmailContainer>
            <ProfileRow style={{margin: 0}}>
              <EthereumAddress>{this.props.user.ethereumAddress}</EthereumAddress>
            </ProfileRow>
            <ProfileRow>
              <Separator/>
            </ProfileRow>
            <ProfileRow>
              {this.props.selectedAccount.EKABalance &&
              this.props.selectedAccount.balance ? (
                <Balances>
                  <SubTitle>Your Balances</SubTitle>
                  <Balance>
                    <EurekaLogo width={30} height={30}/>
                    <Number>
                      {numberWithCommas(this.props.selectedAccount.EKABalance)} EKA
                    </Number>
                    <SeeHistory>
                      <Icon
                        width={22}
                        height={22}
                        material={'history'}
                        icon={'material'}
                        top={8}
                      />
                      <div style={{marginTop: '-5px'}}>See History</div>
                    </SeeHistory>
                  </Balance>
                  <Balance>
                    <Icon
                      icon={'ethereum'}
                      width={25}
                      height={25}
                      right={5}
                      noMove
                    />
                    <Number>
                      {numberWithCommas(
                        this.props.selectedAccount.balance.toString().substr(0, 6)
                      )}{' '}
                      ETH
                    </Number>
                  </Balance>
                </Balances>
              ) : (
                <CircleSpinner/>
              )}
            </ProfileRow>
          </Card>
        </CardContainer>
      </Container>
    );
  }
}

export default MyAccount;
