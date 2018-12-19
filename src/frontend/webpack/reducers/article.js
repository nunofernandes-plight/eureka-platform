import {
  ERROR_FETCHING_ARTCLE_DATA,
  RECEIVED_ARTICLE_DATA,
  START_FETCHING_ARTICLE_DATA
} from './types.js';
import {ARTICLE_ERROR} from '../constants/ModalErrors.js';
import {fetchArticle} from '../components/Articles/Online/TextEditor/DocumentMainMethods.js';
import Document from '../../../models/Document.mjs';
import {deserializeDocument} from '../../../helpers/documentSerializer.mjs';

const initialState = {
  articleDataLoading: null,
  articleDataError: null,
  article: null,
  document: null,
};

export const fetchingArticleData = (articleId) => {
  return dispatch => {
    dispatch({type: START_FETCHING_ARTICLE_DATA});
    fetchArticle(articleId)
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let document = new Document(response.data.document);
          let deserialized = deserializeDocument(document);
          dispatch({
            type: RECEIVED_ARTICLE_DATA,
            article: response.data,
            document: deserialized
          });
        } else {
          dispatch({
            type: ERROR_FETCHING_ARTCLE_DATA,
            error: ARTICLE_ERROR
          });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({
          type: ERROR_FETCHING_ARTCLE_DATA,
          error: err
        });
      });
  };
};

export const articleData = (state = initialState, action) => {
  switch (action.type) {
    case START_FETCHING_ARTICLE_DATA:
      return {
        articleDataLoading: true
      };
    case RECEIVED_ARTICLE_DATA:
      return {
        article: action.article,
        document: action.document,
        articleDataLoading: false
      };
    case ERROR_FETCHING_ARTCLE_DATA:
      return {
        articleDataLoading: false,
        articleDataError: action.error
      };
    default:
      return state;
  }
};