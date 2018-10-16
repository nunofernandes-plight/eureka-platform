import {getDomain} from '../../../../helpers/getDomain.mjs';

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

export const saveReviewDraftToDB = review => {
  return fetch(`${getDomain()}/api/reviews/editorApproved`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(review)
  });
};

export const addCommunityReviewToDB = review => {
  return fetch(`${getDomain()}/api/reviews/community`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(review)
  });
};

export const addAnnotation = review => {
  return fetch(`${getDomain()}/api/annotations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(review)
  });
};
