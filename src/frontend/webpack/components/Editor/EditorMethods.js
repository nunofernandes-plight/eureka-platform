import {getDomain} from '../../../../helpers/getDomain.js';

export const getUnassignedSubmissions = () => {
  return fetch(`${getDomain()}/api/submissions/unassigned`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};
