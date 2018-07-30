import web3 from './web3Instance.mjs';

const getArticleHex = article => {
  // convert the articleVersion test data to hex strings
  let articleHashHex = '0x' + article.articleHash;
  let urlHex64 = web3.utils.padRight(web3.utils.toHex(article.url), 64);

  // length of authors array
  let authorsLengthHex4 = web3.utils.padLeft(   // for number add padLeft instead of right
    web3.utils.toHex(article.authors.length),
    4
  );
  // authors contribution ratio
  let contributorsHex4 = [];
  article.contributorRatios.forEach(ratio => {
    contributorsHex4.push(web3.utils.padLeft(
      web3.utils.toHex(ratio),
      4
    ));
  });

  // length of linked articles array
  let linkedArticleLengthHex4 = web3.utils.padLeft(
    web3.utils.toHex(article.linkedArticles.length),
    4
  );
  // linked articles split ratio
  let linkedArticlesRatioHex4 = [];
  article.linkedArticlesSplitRatios.forEach(ratio => {
    linkedArticlesRatioHex4.push(web3.utils.padLeft(
      web3.utils.toHex(ratio),
      4
    ));
  });


  /*
   connect the hex strings
    */
  let dataInHex =
    articleHashHex + urlHex64.substring(2) + authorsLengthHex4.substring(2);

  let i = 0;
  article.authors.forEach(address => {
    dataInHex = dataInHex + address.substring(2) + contributorsHex4[i++].substring(2);
  });

  i = 0;
  dataInHex += linkedArticleLengthHex4.substring(2);
  article.linkedArticles.forEach(linkedArticleHash => {
    dataInHex = dataInHex + linkedArticleHash + linkedArticlesRatioHex4[i++].substring(2);
  });

  return dataInHex;
};

export default getArticleHex;
