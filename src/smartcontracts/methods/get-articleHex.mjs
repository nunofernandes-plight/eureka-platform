const getArticleHex = (web3, article) => {
  let amountOfArrays = 4;
  let arrayDataStartByte =
    0 + // address msg.sender
    32 + // uint256 value
    32 + // bytes32 articleHash
    32 + // bytes32 url
    32 +
    amountOfArrays * 32;

  /*
   connect the hex strings
    */
  let dataInHex =
    '0x' + // articleHash
    article.articleHash + // URL
    web3.utils.padRight(web3.utils.toHex(article.url), 64).substring(2);

  // reference author array
  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(arrayDataStartByte), 64)
    .substring(2);
  arrayDataStartByte += 32 * (article.authors.length + 1);

  //reference contribution array
  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(arrayDataStartByte), 64)
    .substring(2);
  arrayDataStartByte += 32 * (article.contributorRatios.length + 1);

  //reference linkedArticles array
  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(arrayDataStartByte), 64)
    .substring(2);
  arrayDataStartByte += 32 * (article.linkedArticles.length + 1);

  //reference linkedArticle split ratio array
  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(arrayDataStartByte), 64)
    .substring(2);
  arrayDataStartByte += 32 * (article.linkedArticlesSplitRatios.length + 1);

  // authors address array
  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(article.authors.length), 64)
    .substring(2);
  article.authors.forEach(address => {
    dataInHex += web3.utils.padLeft(address, 64).substring(2);
  });

  // contributorRatio array
  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(article.contributorRatios.length), 64)
    .substring(2);
  article.contributorRatios.forEach(ratio => {
    dataInHex += web3.utils.padLeft(web3.utils.toHex(ratio), 64).substring(2);
  });

  //linked articles array
  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(article.linkedArticles.length), 64)
    .substring(2);
  article.linkedArticles.forEach(hash => {
    dataInHex += hash;
  });

  //linked articles split ratio array
  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(article.linkedArticlesSplitRatios.length), 64)
    .substring(2);
  article.linkedArticlesSplitRatios.forEach(ratio => {
    dataInHex += web3.utils.padLeft(web3.utils.toHex(ratio), 64).substring(2);
  });

  /*
  console.log('Article data hex string: ' + dataInHex);
*/

  return dataInHex;
};

export default getArticleHex;
