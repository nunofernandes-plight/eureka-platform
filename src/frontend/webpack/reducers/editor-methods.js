import {
  ERROR_FETCHING_ARTICLES_TO_SIGNOFF,
  ERROR_FETCHING_UNASSIGNED_SUBMISSIONS,
  RECEIVED_ARTICLES_TO_SIGNOFF,
  RECEIVED_UNASSIGNED_SUBMISSIONS,
  START_FETCHING_ARTICLES_TO_SIGNOFF,
  START_FETCHING_UNASSIGNED_SUBMISSIONS
} from './types.js';
import {EDITOR_ERROR, TITLE_GENERAL_ERROR} from '../constants/ModalErrors.js';
import {
  getArticlesToSignOff,
  getUnassignedSubmissions
} from '../components/Editor/EditorMethods.js';

const unassignedSubmissionsInitialState = {
  loading: false,
  articles: null,
  nrOfPages: null,
  error: null,
  limit: 10,

  loadingSignOff: true,
  articlesToSignOff: null,
  errorSignOff: null
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

export const fetchArticlesToSignOff = () => {
  return dispatch => {
    dispatch({type: START_FETCHING_ARTICLES_TO_SIGNOFF});
    getArticlesToSignOff()
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          dispatch({
            type: RECEIVED_ARTICLES_TO_SIGNOFF,
            articlesToSignOff: response.data
          });
        } else {
          dispatch({
            type: ERROR_FETCHING_ARTICLES_TO_SIGNOFF,
            errorSignOff: EDITOR_ERROR
          });
        }
      })
      .catch(err => {
        dispatch({
          type: ERROR_FETCHING_ARTICLES_TO_SIGNOFF,
          errorSignOff: err
        });
        console.error(err);
      });
  };
};

export const editorsData = (
  state = unassignedSubmissionsInitialState,
  action
) => {
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

    case START_FETCHING_ARTICLES_TO_SIGNOFF:
      return {
        loadingSignOff: true
      };
    case RECEIVED_ARTICLES_TO_SIGNOFF:
      return {
        articlesToSignOff: action.articlesToSignOff,
        loadingSignOff: false
      };
    case ERROR_FETCHING_ARTICLES_TO_SIGNOFF:
      return {
        errorSignOff: action.errorSignOff,
        loadingSignOff: false
      };
    default:
      return state;
  }
};
