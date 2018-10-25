import sha256 from 'js-sha256';
import CANON from 'canon';
import Document from '../models/Document.mjs';
import {getDomain} from './getDomain.mjs';
import getArticleHex from '../smartcontracts/methods/get-articleHex.mjs';
import web3 from './web3Instance.mjs';
import {renderField} from '../frontend/webpack/components/TextEditor/DocumentRenderer.mjs';

export const getArticleHashFromDocument = document => {
  const doc = new Document(document);
  let articleHash = '';

  doc.getAllFields().map(field => {
    if (doc[field]) {
      const value = renderField(doc, field);
      articleHash += hashField(value);
    }
  });
  return sha256(CANON.stringify(articleHash));
};

export const hashField = field => {
  return sha256(CANON.stringify(field));
};

const getInputData = article => {
  return {
    articleHash: article.articleHash.toString().substr(2),
    url: `${getDomain()}/app/preview/${article._id}`,
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
  return getArticleHex(web3, input);
};

export const getReviewHash = (review, annotations) => {
  let reviewHash = hashField(review.reviewText);

  annotations.map(annotation => {
    reviewHash += hashField(annotation.field);
    reviewHash += hashField(annotation.sentenceId);
    reviewHash += hashField(annotation.text);
    reviewHash += hashField(annotation.isMajorIssue);
    reviewHash += hashField(annotation.created);
    reviewHash += hashField(annotation.updated);
  });
  return sha256(CANON.stringify(reviewHash));
};
