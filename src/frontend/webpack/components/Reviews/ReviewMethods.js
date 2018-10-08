import {getDomain} from '../../../../helpers/getDomain.mjs';
import {serializeSavePatch} from '../../../../helpers/documentSerializer.mjs';

export const getArticlesInvitedForReviewing = () => {
  return fetch(`${getDomain()}/api/reviews/invited`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const getArticlesOpenToReview = () => {
  return fetch(`${getDomain()}/api/articles/reviewable/community`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const getMyReviews = () => {
  return fetch(`${getDomain()}/api/reviews/myreviews`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const addEditorApprovedReview = review => {
  return fetch(`${getDomain()}/api/reviews/editorApproved`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(review)
  });
};
