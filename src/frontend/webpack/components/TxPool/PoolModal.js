import React, {Fragment} from 'react';
import styled, {keyframes} from 'styled-components';
import {PANEL_LEFT_NORMAL_WIDTH} from '../../../helpers/layout.js';
import {__FIFTH, __GRAY_300, __GRAY_400} from '../../../helpers/colors.js';
import Transactions from './Transactions.js';
import connect from 'react-redux/es/connect/connect.js';
import {fetchTransactions} from '../../reducers/transactions.js';

const Parent = styled.div`
  position: fixed;
  z-index: 1050;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(99, 114, 130, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const modalFade = keyframes`
 from {transform: translateY(-70%);opacity: 0;}
  to {transform: translateY(0);opacity: 1;}
`;

const MyModal = styled.div`
  margin-left: ${PANEL_LEFT_NORMAL_WIDTH / 2}px;
  position: fixed;
  animation: ${modalFade};
  animation-duration: 0.5s;
  transition: 0.3s linear ease-in-out;
  max-width: 100%;
  max-height: 90%;
  z-index: 12;
  overflow: scroll;
  width: 50%;
  border-radius: 5px;
`;

const FooterContainer = styled.div`
  min-height: 50px;
  background: ${__GRAY_300};
  margin-top: auto;
  border-top: 1px solid ${__GRAY_400};
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const Header = styled.div`
  min-height: 45px;
  background: ${__FIFTH};
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 100000;
  width: 50%;
  visibility: ${props => (props.loading ? 'hidden' : 'visible')};
`;

const TxPoolIcon = styled.img`
  width: 22px;
  height: 20px;
  margin-left: 2px;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 14px;
  text-transform: uppercase;
  display: flex;
`;

const PoolModal = ({show, ...otherProps}) => {
  return (
    <Fragment>
      {show ? (
        <Parent>
          <MyModal>
            <Header loading={otherProps.loading}>
              <HeaderTitle>
                Transaction Pool <TxPoolIcon src="/img/tx/transaction.svg" />{' '}
              </HeaderTitle>
            </Header>
            <Transactions />
            <FooterContainer />
          </MyModal>
        </Parent>
      ) : null}
    </Fragment>
  );
};

export default connect(state => ({
  loading: state.transactionsData.fetchingTxLoading
}))(PoolModal);
