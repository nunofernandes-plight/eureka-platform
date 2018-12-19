import React, {Fragment} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {openTxModal} from '../reducers/txPool.js';
import connect from 'react-redux/es/connect/connect.js';
import {__ALERT_ERROR} from '../../helpers/colors.js';
import Icon from '../views/icons/Icon.js';

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

export const EditorSuccessMessage = ({path, articleId, text}) => {
  return (
    <Notification>
      {' '}
      <Icon
        icon={'material'}
        material={'check_circle_outline'}
        width={15}
        height={15}
        right={5}
      />
      {text}. Find the article
      <Linker path={`/app/preview/${articleId}`}>here</Linker>
      or go to the <Linker path={path}>next step</Linker>.
    </Notification>
  );
};
