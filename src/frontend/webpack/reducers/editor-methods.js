import {
  ERROR_FETCHING_UNASSIGNED_SUBMISSIONS,
  RECEIVED_UNASSIGNED_SUBMISSIONS,
  START_FETCHING_UNASSIGNED_SUBMISSIONS,
} from './types.js';
import {EDITOR_ERROR} from '../constants/ModalErrors.js';
import {getUnassignedSubmissions} from '../components/Editor/EditorMethods.js';

const unassignedSubmissionsInitialState = {
  loading: false,
  articles: null,
  nrOfPages: null,
  error: null,
  limit: 10
};

export const fetchUnassignedSubmissions = page => {
  return dispatch => {
    dispatch({type: START_FETCHING_UNASSIGNED_SUBMISSIONS});
    getUnassignedSubmissions(page, unassignedSubmissionsInitialState.limit)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          dispatch({
            type: RECEIVED_UNASSIGNED_SUBMISSIONS,
            articles: response.data.array,
            nrOfPages: response.data.nrOfPages
          });
        } else {
          dispatch({
            type: ERROR_FETCHING_UNASSIGNED_SUBMISSIONS,
            error: response.error
          });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: ERROR_FETCHING_UNASSIGNED_SUBMISSIONS,
          error: EDITOR_ERROR
        });
      });
  };
};

export const unassignedArticlesData = (state = unassignedSubmissionsInitialState, action) => {
  switch (action.type) {
    case START_FETCHING_UNASSIGNED_SUBMISSIONS:
      return {
        loading: true
      };
    case RECEIVED_UNASSIGNED_SUBMISSIONS:
      return {
        articles: action.articles,
        nrOfPages: action.nrOfPages,
        loading: false
      };
    case ERROR_FETCHING_UNASSIGNED_SUBMISSIONS:
      return {
        error: action.error,
        loading: false
      };
    default:
      return state;
  }
};
