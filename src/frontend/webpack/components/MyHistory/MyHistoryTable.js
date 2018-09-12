import React from 'react';
import styled from 'styled-components';
import TxType from './TxType.js';
import {Link} from 'react-router-dom';
import {Table} from '../../design-components/Table/Table.js';
import TxHash from '../../views/TxHash.js';
import {renderTimestamp} from '../../../helpers/timestampRenderer';
import EurekaLogo from '../../views/icons/EurekaLogo';

const ContactsContainer = styled.div`
  font-size: 14px;
  width: 100%;
  max-height: 400px;
  overflow: scroll;
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
    data.push({
      logo: getLogo(),
      transactionType: getTxType(tx),
      txHash: getTxHash(tx),
      timestamp: getTimestamp(tx),
      from: getOwner(tx),
      to: getAffectedAddress(tx)
    });
  });
  return data;
};

const getOwner = tx => {
  return <div>{tx.ownerAddress.substr(0, 15)}...</div>;
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
const getTxHash = tx => {
  return (
    <TxHash txHash={tx.txHash}>{tx.txHash.toString().substr(0, 20)}...</TxHash>
  );
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
          header={[
            '',
            'Transaction Type',
            'Tx Hash',
            'Transaction date',
            'From',
            'To'
          ]}
          textCenter={'Transaction Type'}
          data={getData(props)}
          columnWidth={['6', '25', '20', '17', '17', '15']}
        />
      )}
    </ContactsContainer>
  );
};

export default MyHistoryTable;
