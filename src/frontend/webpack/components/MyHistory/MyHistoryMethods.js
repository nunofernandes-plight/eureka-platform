import {getDomain} from '../../../../helpers/getDomain.js';

export const getTransactions = () => {
  return fetch(`${getDomain()}/api/sctransactions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};
