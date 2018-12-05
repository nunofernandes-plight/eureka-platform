import {getDomain} from '../../../../helpers/getDomain.mjs';

export const getUnassignedSubmissions = (page, limit) => {
  return fetch(
    `${getDomain()}/api/submissions/unassigned?page=` +
      page +
      `&limit=` +
      limit,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
  );
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

export const createReviewInvitation = (reviewerAddress, articleHash, reviewType) => {
  return fetch(`${getDomain()}/api/reviews/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      reviewerAddress,
      articleHash,
      reviewType
    })
  });
};

export const getReviewsToCheck = () => {
  return fetch(`${getDomain()}/api/reviews/checkable`, {
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
