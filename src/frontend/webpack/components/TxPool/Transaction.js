import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_ERROR,
  __ALERT_SUCCESS,
  __ALERT_WARNING,
  __GRAY_100,
  __GRAY_300
} from '../../../helpers/colors.js';
import TRANSACTION_STATUS from '../../../../helpers/TransactionStatus.mjs';
import EurekaLogo from '../../views/icons/EurekaLogo.js';
import TxType from '../MyHistory/TxType.js';
import {ProgressBar} from './ProgressBar.js';
import * as animationData from '../TxPool/spinner.json';
import LottieManager from '../LottieManager.js';
import {Animation} from './Animation.js';

const getColor = status => {
  switch (status) {
    case TRANSACTION_STATUS.IN_PROGRESS:
      return __ALERT_WARNING;

    case TRANSACTION_STATUS.COMPLETED:
      return __ALERT_SUCCESS;

    case TRANSACTION_STATUS.ERROR:
      return __ALERT_ERROR;
    default:
      return __GRAY_100;
  }
};
export const TxLi = styled.li`
  &:hover {
    cursor: pointer;
    background: ${__GRAY_100};
  }
  transition: 0.3s ease-in-out all;
  color: ${props => getColor(props.status)};
  display: flex;
  padding: 1em 2em;
  border-bottom: 1px solid ${__GRAY_300};
  align-items: center;
  overflow: hidden;
  overflow-y: scroll;
`;

const LottieContainer = styled.div`
  margin-left: auto;
`;

const BarContainer = styled.div`
  position: relative;
  margin: 0 20px;
`;

const Transaction = ({tx, ...otherProps}) => {
  return (
    <TxLi key={tx.txHash} status={tx.status}>
      <EurekaLogo width={20} height={20} />
      <BarContainer>
        <TxType
          type={tx.transactionType}
          padding={'5px 20px'}
          size={'12'}
          radius={'0'}
          noMargin
        />
        {tx.status === TRANSACTION_STATUS.IN_PROGRESS ? (
          <ProgressBar height={3} />
        ) : (
          <ProgressBar height={3} static />
        )}
      </BarContainer>
      {tx.status}
      <LottieContainer>
        <Animation status={tx.status} />
      </LottieContainer>
    </TxLi>
  );
};

export default Transaction;
