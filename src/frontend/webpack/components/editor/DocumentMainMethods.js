import {getDomain} from '../../../../helpers/getDomain.js';
import {serializeSavePatch} from '../../../../helpers/documentSerializer.mjs';

export const submitArticle = (draftId, article) => {
  return fetch(`${getDomain()}/api/articles/drafts/${draftId}/submit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      articleHash: '0x' + article.articleHash
    })
  });
};

export const saveArticle = draftId => {
  return fetch(`${getDomain()}/api/articles/drafts/${draftId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      document: serializeSavePatch(patch)
    })
  });
};

export const fetchArticle = draftId => {
  return fetch(`${getDomain()}/api/articles/drafts/${draftId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};

export const revertArticleToDraft = draftId => {
  return fetch(`${getDomain()}/api/articles/drafts/${draftId}/revert`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
};
