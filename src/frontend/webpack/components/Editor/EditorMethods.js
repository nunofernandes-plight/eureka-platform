import {getDomain} from '../../../../helpers/getDomain.mjs';

export const getUnassignedSubmissions = () => {
  return fetch(`${getDomain()}/api/submissions/unassigned`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const getArticlesToSignOff = () => {
  return fetch(`${getDomain()}/api/articles/assigned/signoff`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const getInviteReviewersArticles = () => {
  return fetch(`${getDomain()}/api/articles/assigned/inviteReviewers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const getCheckReviewersArticles = () => {
  return fetch(`${getDomain()}/api/articles/assigned/checkReviews`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const getArticlesToFinalize = () => {
  return fetch(`${getDomain()}/api/articles/assigned/finalize`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};
