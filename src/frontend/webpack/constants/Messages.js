import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
const Notification = styled.div``;

const MyLink = styled(Link)`
  font-weight: bold;
`;

/*
const mapDispatchToProps = dispatch => ({
  fetchNetwork: () => {
    dispatch(fetchNetwork());
  }
});
const mapStateToProps = state => ({
  network: state.networkData.network
});
*/

/**
 * EDITOR NOTIFICATIONS
 **/
export const ARTICLE_ASSIGNED_TX = ({closeToast, tx}) => {
  return (
    <Notification>
      <strong>Dear editor</strong>,
      <br />
      Your request will be processed in the next minutes⏳. If you may be
      interested in tracking the transaction you can click
      <MyLink onClick={closeToast} style={{marginLeft: 2}} to={'tdb'}>
        <strong>here.</strong>
      </MyLink>
      <br />
      In the mean time, you can assign other articles to yourself or{' '}
      <MyLink to={'signoff'} onClick={closeToast} style={{marginLeft: 2}}>
        continuing with the editorial assessment process{' '}
      </MyLink>
    </Notification>
  );
};
export const ARTCILE_ASSIGNED_CONFIRMED = () => {};
