import web3 from './web3Instance.mjs';
import getAccounts from './get-accounts.mjs';

let accounts = [];

const testMethod = async (eurekaTokenContract, eurekaPlatformContract) => {

  await mintEurekaTokens(eurekaTokenContract, eurekaPlatformContract);


  let article = 'sali';
  let url = 'hoihoi';
  let linkedArticles = ['ciaoHash', 'adiosHash', 'adieuHash'];
  let authors = ['0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba88', '0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba77'];

  // convert the articleVersion to a bytes array
  let articleBytes32 = web3.utils.padRight(web3.utils.toHex(article), 64);
  let urlBytes32 = web3.utils.padRight(web3.utils.toHex(url), 64);
  let authorsLength = web3.utils.padLeft(web3.utils.toHex(authors.length), 4);   // for number add padLeft instead of right
  let authorsInBytes = [];
  authors.forEach((address) => {
    authorsInBytes.push(address);
  });
  let linkedArticleLength = web3.utils.padLeft(web3.utils.toHex(linkedArticles.length), 4);   // for number add padLeft instead of right
  let linkedArticlesInBytes = [];
  linkedArticles.forEach((articleHash) => {
    linkedArticlesInBytes.push(
      web3.utils.padRight(web3.utils.toHex(articleHash), 64)
    );
  });

  let dataInBytes =
    articleBytes32
    + urlBytes32.substring(2)
    + authorsLength.substring(2);
  authorsInBytes.forEach((address) => {
    dataInBytes = dataInBytes + address.substring(2);
  });
  dataInBytes += linkedArticleLength.substring(2);
  linkedArticlesInBytes.forEach((bytes32) => {
    dataInBytes = dataInBytes + bytes32.substring(2);
  });

  console.log(dataInBytes);

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
      console.error(err);
    });

  await getBalanceOf(eurekaTokenContract, eurekaPlatformContract.options.address);

  await eurekaPlatformContract.methods
    .articleVersions(articleBytes32)
    .call({
      from: accounts[1]
    })
    .then((receipt) => {
      console.log(receipt);
      let encodedUrl = web3.utils.hexToAscii(receipt.articleUrl);
      console.log('Entered URL: ' + encodedUrl);
    })
    .catch((err) => {
      console.error(err)
    });

  await eurekaPlatformContract.methods
    .getAuthors(articleBytes32)
    .call({
      from: accounts[1]
    })
    .then((receipt) => {
      console.log(receipt);
    })
    .catch((err) => {
      console.error(err)
    });

  await eurekaPlatformContract.methods
    .getLinkedArticles(articleBytes32)
    .call({
      from: accounts[1]
    })
    .then((receipt) => {
      receipt.forEach((text) => {
        console.log(web3.utils.hexToAscii(text));
      })
    })
    .catch((err) => {
      console.error(err);
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
    .then(succ => {
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
