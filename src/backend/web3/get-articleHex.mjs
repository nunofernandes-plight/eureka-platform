import web3 from './web3Instance.mjs';

const getArticleHex = (article) => {

  // convert the articleVersion test data to hex strings
  let articleHashHex = '0x' + article.articleHash;
  let urlHex64 = web3.utils.padRight(web3.utils.toHex(article.url), 64);
  let authorsLengthHex4 = web3.utils.padLeft(web3.utils.toHex(article.authors.length), 4);   // for number add padLeft instead of right
  let linkedArticleLengthHex4 = web3.utils.padLeft(web3.utils.toHex(article.linkedArticles.length), 4);   // for number add padLeft instead of right

  // connect the hex strings
  let dataInHex =
    articleHashHex
    + urlHex64.substring(2)
    + authorsLengthHex4.substring(2);
  article.authors.forEach((address) => {
    dataInHex = dataInHex + address.substring(2);
  });
  dataInHex += linkedArticleLengthHex4.substring(2);
  article.linkedArticles.forEach((linkedArticleHash) => {
    dataInHex = dataInHex + linkedArticleHash;
  });

  return dataInHex;
};

export default getArticleHex;
