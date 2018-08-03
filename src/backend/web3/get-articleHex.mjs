import web3 from './web3Instance.mjs';

const getArticleHex = article => {

  let amountOfArrays = 4;
  let arrayDataStartByte = 32 + 32 + amountOfArrays * 32;

  /*
   connect the hex strings
    */
  let dataInHex = '0x'
    + article.articleHash
    + web3.utils.padRight(web3.utils.toHex(article.url), 64).substring(2);

  dataInHex += web3.utils.padLeft(web3.utils.toHex(arrayDataStartByte), 64).substring(2);
  arrayDataStartByte += 32 * (article.authors.length + 1);

  dataInHex += web3.utils.padLeft(web3.utils.toHex(arrayDataStartByte), 64).substring(2);
  arrayDataStartByte += 32 * (article.contributorRatios.length + 1);

  dataInHex += web3.utils.padLeft(web3.utils.toHex(arrayDataStartByte), 64).substring(2);
  arrayDataStartByte += 32 * (article.linkedArticles.length + 1);

  dataInHex += web3.utils.padLeft(web3.utils.toHex(arrayDataStartByte), 64).substring(2);
  arrayDataStartByte += 32 * (article.linkedArticlesSplitRatios.length + 1);

  //authors address
  dataInHex += web3.utils.padLeft(web3.utils.toHex(article.authors.length), 64).substring(2);
  article.authors.forEach(address => {
    dataInHex += web3.utils.padLeft(address, 64).substring(2);
  });

  //contributorRatio
  dataInHex += web3.utils.padLeft(web3.utils.toHex(article.contributorRatios.length), 64).substring(2);
  article.contributorRatios.forEach(ratio => {
    dataInHex += web3.utils.padLeft(web3.utils.toHex(ratio), 64).substring(2);
  });

  //linked articles array
  dataInHex += web3.utils.padLeft(web3.utils.toHex(article.linkedArticles.length), 64).substring(2);
  article.linkedArticles.forEach(hash => {
    dataInHex += hash
  });

  //linked articles split ratio
  dataInHex += web3.utils.padLeft(web3.utils.toHex(article.linkedArticlesSplitRatios.length), 64).substring(2);
  article.linkedArticlesSplitRatios.forEach(ratio => {
    dataInHex += web3.utils.padLeft(web3.utils.toHex(ratio), 64).substring(2);
  });

  console.log('Article data hex string: ' + dataInHex);

  return dataInHex;
};

export default getArticleHex;
