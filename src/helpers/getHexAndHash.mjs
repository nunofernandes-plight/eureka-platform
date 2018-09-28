import sha256 from 'js-sha256';
import { stringify } from 'canonicaljson';

export const getArticleHashFromDocument = document => {
  return sha256(stringify(document));
};

export const getArticleHexFromDocument = document => {};
