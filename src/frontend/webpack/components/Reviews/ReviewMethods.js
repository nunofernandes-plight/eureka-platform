import {getDomain} from '../../../../helpers/getDomain.mjs';

export const getArticlesInvitedForReviewing = () => {
  return fetch(`${getDomain()}/api/articles/reviewable/invited`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};
