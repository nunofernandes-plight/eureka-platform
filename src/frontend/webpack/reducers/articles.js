import {getDomain} from '../../../helpers/getDomain.mjs';
import {ONLINE_DRAFTS, TITLE_GENERAL_ERROR} from '../constants/ModalErrors.js';
import {
  ERROR_FETCHING_ONLINE_DRAFTS,
  RECEIVED_ONLINE_DRAFTS,
  START_FETCHING_ONLINE_DRAFTS
} from './types.js';

const initialState = {
  onlineDrafts: null,
  onlineDraftsLoading: null,
  onlineDraftError: null
};

export const fetchOnlineDrafts = () => {
  return async dispatch => {
    dispatch({type: START_FETCHING_ONLINE_DRAFTS});
    fetch(`${getDomain()}/api/articles/drafts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          dispatch({
            type: RECEIVED_ONLINE_DRAFTS,
            onlineDrafts: response.data
          });
        } else {
          dispatch({
            type: ERROR_FETCHING_ONLINE_DRAFTS,
            error: ONLINE_DRAFTS
          });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: ERROR_FETCHING_ONLINE_DRAFTS,
          error: err
        });
      });
  };
};

export const articlesData = (state = initialState, action) => {
  switch (action.type) {
    case START_FETCHING_ONLINE_DRAFTS:
      return {
        onlineDraftsLoading: true
      };
    case RECEIVED_ONLINE_DRAFTS:
      return {
        onlineDraftsLoading: false,
        onlineDrafts: action.onlineDrafts
      };
    case ERROR_FETCHING_ONLINE_DRAFTS:
      return {
        onlineDraftsLoading: false,
        onlineDrafts: action.error
      };
    default:
      return state;
  }
};
