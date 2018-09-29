import sha256 from 'js-sha256';
import CANON from 'canon';
import {deserializeDocument} from './documentSerializer.mjs';
import Document from '../models/Document.mjs';
import {renderField} from '../frontend/webpack/components/TextEditor/DocumentRenderer.mjs';

export const getArticleHashFromDocument = document => {
  const doc = new Document(document);
  let articleHash = '';
  doc.getAllFields().map(field => {
    articleHash += hashField(field);
  });
  return sha256(CANON.stringify(articleHash));
};

export const hashField = field => {
  return sha256(CANON.stringify(field));
};

export const getArticleHexFromDocument = document => {};
