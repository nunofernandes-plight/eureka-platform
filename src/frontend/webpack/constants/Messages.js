import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {openTxModal} from '../reducers/txPool.js';
import connect from 'react-redux/es/connect/connect.js';
const Notification = styled.div``;

const MyLink = styled(Link)`
  font-weight: bold;
`;

const mapDispatchToProps = dispatch => ({
  openModal: () => {
    dispatch(openTxModal());
  }
});

/**
 * EDITOR NOTIFICATIONS
 **/

export const ArticleAssignedMessage = connect(
  null,
  mapDispatchToProps
)(({closeToast, tx, ...otherProps}) => {
  return (
    <Notification>
      <strong>Dear editor</strong>,
      <br />
      You can track this transaction
      <strong
        onClick={() => {
          closeToast();
          otherProps.openModal();
        }}
      >
        here
      </strong>
      <br />
      In the mean time, you can assign other articles to yourself or{' '}
      <MyLink to={'signoff'} onClick={closeToast} style={{marginLeft: 2}}>
        continuing with the editorial assessment process{' '}
      </MyLink>
    </Notification>
  );
});
export const ARTCILE_ASSIGNED_CONFIRMED = () => {};
