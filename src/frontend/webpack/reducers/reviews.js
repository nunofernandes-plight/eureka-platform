import {getArticlesOpenToReview} from '../components/Reviews/ReviewMethods.js';
import {
  ERROR_ARTICLES_OPEN_TO_REVIEW,
  RECEIVED_ARTICLES_OPEN_TO_REVIEW,
  START_FETCH_ARTICLES_OPEN_TO_REVIEW
} from './types.js';
import {REVIEWS_ERROR, TITLE_GENERAL_ERROR} from '../constants/ModalErrors.js';

const initialState = {
  articlesOpenToReviewLoading: null,
  articlesOpenToReview: true,
  articlesOpenToReviewError: null,
  nrOfPages: null,
  limit: 10
};

export const fetchArticlesOpenToReview = (page) => {
  return async dispatch => {
    dispatch({type: START_FETCH_ARTICLES_OPEN_TO_REVIEW});
    getArticlesOpenToReview(page, initialState.limit)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          dispatch({
            type: RECEIVED_ARTICLES_OPEN_TO_REVIEW,
            articles: response.data.array,
            nrOfPages: response.data.nrOfPages
          });
        } else {
          dispatch({
            type: ERROR_ARTICLES_OPEN_TO_REVIEW,
            error: REVIEWS_ERROR
          });
        }
      })
      .catch(err => {
        dispatch({
          type: ERROR_ARTICLES_OPEN_TO_REVIEW,
          error: err
        });
        console.error(err);
      });
  };
};

export const reviewsData = (state = initialState, action) => {
  switch (action.type) {
    case START_FETCH_ARTICLES_OPEN_TO_REVIEW:
      return {
        articlesOpenToReviewLoading: true
      };
    case RECEIVED_ARTICLES_OPEN_TO_REVIEW:
      return {
        articlesOpenToReview: action.articles,
        articlesOpenToReviewLoading: false,
        nrOfPages: action.nrOfPages
      };
    case ERROR_ARTICLES_OPEN_TO_REVIEW:
      return {
        articlesOpenToReviewLoading: false,
        articlesOpenToReviewError: action.error
      };
    default:
      return state;
  }
};
