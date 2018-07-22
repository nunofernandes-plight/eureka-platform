import web3 from './web3Instance.mjs';
import getAccounts from "./get-accounts.mjs";

let accounts = [];

const testMethod = async (eurekaTokenContract, eurekaPlatformContract) => {

  await mintEurekaTokens(eurekaTokenContract, eurekaPlatformContract);


  let article = 'salit';
  let url = 'hoihoi';
  let linkedArticles = ['ciaoHash', 'adiosHash'];

  // convert the articleVersion to a bytes array
  let articleBytes32 = web3.utils.padRight(web3.utils.utf8ToHex(article), 64);
  let urlBytes32 = web3.utils.padRight(web3.utils.utf8ToHex(url), 64);
  let linkedArticleLength = web3.utils.padLeft(web3.utils.numberToHex(linkedArticles.length), 4);   // for number add padLeft instead of right
  let linkedArticlesInBytes = [];
  linkedArticles.forEach( (articleHash) => {
    linkedArticlesInBytes.push(
      web3.utils.padRight(web3.utils.utf8ToHex(articleHash), 64)
    );
  });

  console.log(linkedArticleLength);
  console.log(web3.utils.hexToNumber(linkedArticleLength));

  let articleInHex = web3.utils.utf8ToHex(article);

  let dataInBytes =
    articleBytes32
    + urlBytes32.substring(2)
    + linkedArticleLength.substring(2);
  linkedArticlesInBytes.forEach( (bytes32) => {
    dataInBytes = dataInBytes + bytes32.substring(2);
  });

  console.log(dataInBytes);
  console.log(eurekaPlatformContract.options.address);

  // submit Article = send submission fee to service contract
  await eurekaTokenContract.methods
    .transferAndCall(eurekaPlatformContract.options.address, 5000, dataInBytes)
    .send({
      from: accounts[1]
    })
    .then((receipt) => {
      console.log('tx status: ' + receipt.status);
    })
    .catch((err) => {
      console.error(err)
    });

  await getBalanceOf(eurekaTokenContract, eurekaPlatformContract.options.address);

  await eurekaPlatformContract.methods
    .articleVersions(articleInHex)
    .call({
      from: accounts[1]
    })
    .then((receipt) => {
      console.log(receipt);
      let encodedUrl = web3.utils.hexToAscii(receipt.articleUrl);
      console.log('Entered URL: '+ encodedUrl);
    })
    .catch((err) => {
      console.error(err)
    });
};


const mintEurekaTokens = async (eurekaTokenContract, eurekaPlatformContract) => {
  accounts = await getAccounts();

  let amounts = [];

  let amount = 10000;
  accounts.forEach(() => {
    amounts.push(amount);
  });

  let gasEstimated = await eurekaTokenContract.methods.mint(accounts, amounts)
    .estimateGas({
      from: accounts[0]
    });

  //Minting
  await eurekaTokenContract.methods
    .mint(accounts, amounts)
    .send({
      from: accounts[0],
      gas: gasEstimated
    })
    .then((receipt) => {
      return receipt;
    });

  await eurekaTokenContract.methods
    .finishMinting()
    .send({
      from: accounts[0]
    })
    .then((receipt) => {
      return receipt;
    });

  eurekaTokenContract.methods
    .totalSupply()
    .call({from: accounts[0]})
    .then( succ => {
      console.log('Total Supply: ' + succ);
    });

  await getBalanceOf(eurekaTokenContract, eurekaPlatformContract.options.address);
};

const getBalanceOf = (contract, account) => {
  return contract.methods
    .balanceOf(account)
    .call({from: account})
    .then((bal) => {
      console.log('balance of ' + account + ': ' + bal);
      return bal;
    })
    .catch((err) => {
      console.error(err);
    });
};

export default testMethod;
