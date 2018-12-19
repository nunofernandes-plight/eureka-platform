import React, {Fragment} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {openTxModal} from '../reducers/txPool.js';
import connect from 'react-redux/es/connect/connect.js';
import {__ALERT_ERROR} from '../../helpers/colors.js';

const Notification = styled.div``;

const MyLink = styled(Link)`
  font-weight: bold;
  margin: 0 1.5px;
`;

const mapDispatchToProps = dispatch => ({
  openModal: () => {
    dispatch(openTxModal());
  }
});

const TransactionTracker = connect(
  null,
  mapDispatchToProps
)(({name, ...otherProps}) => {
  return (
    <Fragment>
      <strong>Dear {name},‍</strong>,
      <br />
      You can track this transaction by clicking{' '}
      <strong
        onClick={() => {
          otherProps.openModal();
        }}
      >
        here.
      </strong>
      <br />
    </Fragment>
  );
});

const Linker = ({path, ...otherProps}) => {
  return (
    <Fragment>
      <MyLink to={path}>{otherProps.children}</MyLink>
    </Fragment>
  );
};

export const EditorInfoMessage = ({path, ...otherProps}) => {
  return (
    <Notification>
      <TransactionTracker name={'handling Editor'} />
      {otherProps.text}
    </Notification>
  );
};

export const EditorSuccessMessage = ({path, id}) => {
  return (
    <Notification>
      <strong>Dear handling Editor, ‍</strong>
      <br />
      The<MyLink to={`/app/preview/${id}`}>article</MyLink>has been
      successfully assigned to yourself.
      <br />
      <Linker path={path}>Click for the next step.</Linker>.
    </Notification>
  );
};
