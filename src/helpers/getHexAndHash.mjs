import sha256 from 'js-sha256';
import CANON from 'canon';

export const getArticleHashFromDocument = document => {
  console.log(document);
  return sha256(CANON.stringify(document));
};

export const getArticleHexFromDocument = document => {};
