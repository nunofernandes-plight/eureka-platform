import sha256 from 'js-sha256';
import CANON from 'canon';
import Document from '../models/Document.mjs';
import {getDomain} from './getDomain.mjs';

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

const getInputData = article => {
  return {
    articleHash: article.articleHash,
    url: `${getDomain()}/app/articles/preview/${article._id}`, //this.state.inputData.url,
    authors: article.document.authors,
    contributorRatios: [4000, 6000],
    linkedArticles: [
      '5f37e6ef7ee3f86aaa592bce4b142ef345c42317d6a905b0218c7241c8e30015'
    ],
    linkedArticlesSplitRatios: [3334, 3333, 3333]
  };
};
export const getArticleHexFromDocument = article => {
  const input = getInputData(article);
  console.log(input);
};
