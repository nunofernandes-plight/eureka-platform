import React from 'react';
import styled from 'styled-components';
import TxType from './TxType.js';
import {Link} from 'react-router-dom';
import {Table} from '../../design-components/Table/Table.js';
import {renderTimestamp} from '../../../helpers/timestampRenderer';
import EurekaLogo from '../../views/icons/EurekaLogo';
import {EthereumAddress} from '../../views/Address.js';

const ContactsContainer = styled.div`
  font-size: 14px;
  width: 100%;
  padding: 5px 25px;
`;

const NoTxs = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const getData = props => {
  let data = [];
  props.txs.map(tx => {
    return data.push({
      logo: getLogo(),
      transactionType: getTxType(tx),
      timestamp: getTimestamp(tx),
      from: getOwner(tx),
      to: getAffectedAddress(tx)
    });
  });
  return data;
};

const getOwner = tx => {
  return <EthereumAddress ethereumAddress={tx.ownerAddress} />;
};
const getAffectedAddress = tx => {
  const to = tx.additionalInfo.affectedAddress;
  if (to) {
    return <div>{to.substr(0, 15)}...</div>;
  } else {
    return <i>EUREKA Smart Contract</i>;
  }
};
const getLogo = () => {
  return <EurekaLogo width={25} height={25} />;
};
const getTimestamp = tx => {
  const date = new Date(tx.updatedAt);
  return <div>{renderTimestamp(date.getTime())}</div>;
};

const getTxType = tx => {
  return <TxType type={tx.transactionType} />;
};

const MyHistoryTable = props => {
  return (
    <ContactsContainer>
      {!props.txs || props.txs.length === 0 ? (
        <NoTxs>
          <i>You don't have any transactions registered yet.</i>

          <Link style={{textDecoration: 'none'}} to={'/app/articles/drafts'}>
            <button> Submit your first article now!</button>
          </Link>
        </NoTxs>
      ) : (
        <Table
          header={['', 'Transaction Type', 'Transaction date', 'From', 'To']}
          textCenter={'Transaction Type'}
          data={getData(props)}
          columnWidth={['6', '25', '17', '37', '15']}
        />
      )}
    </ContactsContainer>
  );
};

export default MyHistoryTable;
