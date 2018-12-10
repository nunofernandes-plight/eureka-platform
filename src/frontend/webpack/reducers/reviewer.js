import {
  BECAME_A_REVIEWER,
  BECOMING_A_REVIEWER,
  ERROR_BECOMING_A_REVIEWER
} from './types.js';
import {REVIEWS_ERROR} from '../constants/ModalErrors.js';
import {getDomain} from '../../../helpers/getDomain.mjs';

const initialState = {
  loading: false
};

export const becomeAReviewer = () => {
  return async dispatch => {
    dispatch({type: BECOMING_A_REVIEWER});
    fetch(`${getDomain()}/api/users/becomeReviewer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          dispatch({type: BECAME_A_REVIEWER});
        } else {
          dispatch({type: ERROR_BECOMING_A_REVIEWER, error: REVIEWS_ERROR});
        }
      })
      .catch(err => {
        dispatch({type: ERROR_BECOMING_A_REVIEWER, error: err});
      });
  };
};

export const reviewerData = (state = initialState, action) => {
  switch (action.type) {
    case BECOMING_A_REVIEWER:
      return {
        loading: true
      };
    case BECAME_A_REVIEWER:
      return {
        loading: false
      };

    case ERROR_BECOMING_A_REVIEWER:
      return {
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};
