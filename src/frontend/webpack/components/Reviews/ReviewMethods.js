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
