import moment from 'moment';
import {
  ERROR_FETCHING_USER,
  RECEIVING_USER,
  START_FETCHING_USER
} from './types.js';
import {getDomain} from '../../../helpers/getDomain.mjs';
import Roles from '../../../backend/schema/roles-enum.mjs';

const initialState = {
  user: null,
  error: null,
  loading: false
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
            type: RECEIVING_USER,
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

/*
  .then(response => response.json())
  .then(response => {
    if (response.success) {
      let user = response.data.user;
      user.roles.push(Roles.USER);
      this.setState({
        user,
        isAuthenticated: response.data.isAuthenticated
      });
    } else {
      this.setState({
        isAuthenticated: false
      });
    }
  })
  .catch(err => {
    console.error(err);
    this.setState({
      isAuthenticated: false
    });
  });*/

export default function(state = initialState, action) {
  switch (action.type) {
    case START_FETCHING_USER:
      return {
        loading: true,
        isAuthenticated: null,
        data: null
      };
    case RECEIVING_USER:
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
}
