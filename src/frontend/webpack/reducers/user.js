import {
  ERROR_FETCHING_USER,
  RECEIVED_USER,
  START_FETCHING_USER
} from './types.js';
import {getDomain} from '../../../helpers/getDomain.mjs';
import Roles from '../../../backend/schema/roles-enum.mjs';

const initialState = {
  user: null,
  error: null,
  isAuthenticated: null,
  loading: true
};

export const fetchUserData = () => {
  return dispatch => {
    dispatch({type: START_FETCHING_USER});
    fetch(`${getDomain()}/api/users/data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let user = response.data.user;
          user.roles.push(Roles.USER);
          dispatch({
            type: RECEIVED_USER,
            user,
            isAuthenticated: response.data.isAuthenticated
          });
        } else {
          dispatch({
            type: ERROR_FETCHING_USER,
            error: 'Something went wrong by fetching the user',
            isAuthenticated: false
          });
        }
      })
      .catch(err => {
        dispatch({
          type: ERROR_FETCHING_USER,
          error: err,
          isAuthenticated: false
        });
      });
  };
};

export const userData = (state = initialState, action) => {
  switch (action.type) {
    case START_FETCHING_USER:
      return {
        loading: true,
        isAuthenticated: null,
        data: null
      };
    case RECEIVED_USER:
      return {
        data: action.user,
        isAuthenticated: action.isAuthenticated,
        error: null,
        loading: false
      };
    case ERROR_FETCHING_USER:
      return {
        data: null,
        error: action.error,
        isAuthenticated: action.isAuthenticated,
        loading: false
      };
    default:
      return state;
  }
};
