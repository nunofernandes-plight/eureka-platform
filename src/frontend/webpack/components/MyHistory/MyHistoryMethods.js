import {getDomain} from '../../../../helpers/getDomain.mjs';

export const getTransactions = () => {
  return fetch(`${getDomain()}/api/sctransactions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};
