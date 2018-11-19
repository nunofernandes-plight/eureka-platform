import React from 'react';
import {fetchUserData} from '../reducers/user.js';

/*const mapDispatchToProps = dispatch => ({
  fetchNetwork: () => {
    dispatch(fetchNetwork());
  }
});
const mapStateToProps = state => ({
  network: state.networkData.network
});*/


/**
 * EDITOR NOTIFICATIONS
 **/
export const ARTICLE_ASSIGNED_TX = ({closeToast, tx}) => {
  return (
    <div>
      <strong>Dear editor</strong>,
      <br />
      Your request will be processed in the next minutes⏳. If you may be
      interested in tracking the transaction you can click
      <a href="#" onClick={closeToast} style={{marginLeft: 2}}>
        here.
      </a>
    </div>
  );
};
export const ARTCILE_ASSIGNED_CONFIRMED = () => {};
