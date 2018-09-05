import {getDomain} from '../../../../helpers/getDomain.js';

export const createContact = (contactAddress, preName, lastName, info) => {
  return fetch(`${getDomain()}/api/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      contactAddress: contactAddress,
      preName: preName,
      lastName: lastName,
      info: info
    })
  });
};

export const getContacts = () => {
  return fetch(`${getDomain()}/api/book`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const updateContact = contact => {
  return fetch(`${getDomain()}/api/book`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      contactAddress: contact.contactAddress,
      preName: contact.preName,
      lastName: contact.lastName,
      info: contact.info
    })
  });
};

export const deleteContact = contactAddress => {
  return fetch(`${getDomain()}/api/book`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      contactAddress: contactAddress
    })
  });
};
