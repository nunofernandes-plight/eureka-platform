import web3 from './web3Instance.mjs';
import getAccounts from "./get-accounts.mjs";
import getArticleHex from "./get-articleHex.mjs";

let article = {
  articleHash: '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
  url: 'hoihoi',
  authors: [
    '0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba88',
    '0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba77'
  ],
  linkedArticles: [
    '5f37e6ef7ee3f86aaa592bce4b142ef345c42317d6a905b0218c7241c8e30015',
    '45bc397f0d43806675ab72cc08ba6399d679c90b4baed1cbe36908cdba09986a',
    'd0d1d5e3e1d46e87e736eb85e79c905986ec77285cd415bbb213f0c24d8bcffb'
  ]
};

let accounts = [];

const testMethod = async (eurekaTokenContract, eurekaPlatformContract) => {

  await mintEurekaTokens(eurekaTokenContract);

  let dataInHex = getArticleHex(article);
  let articleHashHex = '0x' + article.articleHash;

  // submit Article = send submission fee to service contract
  await submitArticle(eurekaTokenContract, accounts[1], eurekaPlatformContract.options.address, 5000, dataInHex)

  console.log('The balance of the service contract is ' + await getBalanceOf(eurekaTokenContract, eurekaPlatformContract.options.address));
  console.log('URL of the article: ' + await getUrl(eurekaPlatformContract, articleHashHex));
  console.log('Authors: ' + await getAuthors(eurekaPlatformContract, articleHashHex));
  console.log('Linked articles: ' + await getLinkedArticles(eurekaPlatformContract, articleHashHex));
};



const mintEurekaTokens = async (eurekaTokenContract) => {
  accounts = await getAccounts();

  let amounts = [];
  let amount = 10000;
  accounts.forEach(() => {
    amounts.push(amount);
  });

  let gasEstimated = await getGasEstimation(eurekaTokenContract.methods.mint(accounts, amounts));

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
      console.log('The EKA token minting has been finished.');
      return receipt;
    });
};

const submitArticle = (_contract, _from, _to, _amount, _data) => {
  return _contract.methods
    .transferAndCall(_to, _amount, _data)
    .send({
      from: _from
    })
    .then((receipt) => {
      console.log('The article submission exited with the TX status: ' + receipt.status);
    })
    .catch((err) => {
      console.error(err)
    });
};


/*
  Getters
 */

const getBalanceOf = (contract, account) => {
  return contract.methods
    .balanceOf(account)
    .call({from: account})
    .then((bal) => {
      return bal;
    })
    .catch((err) => {
      console.error(err);
    });
};

const getTotalSupplyOf = (contract, fromAccount) => {
  return contract.methods
    .totalSupply()
    .call({from: fromAccount})
    .then(supply => {
      return supply;
    })
    .catch((err) => {
      console.error(err);
    });
};

const getGasEstimation = (func) => {
  return func.estimateGas({
    from: accounts[0]
  });
};

const getUrl = (contract, articleHashHex) => {
  return contract.methods
    .articleVersions(articleHashHex)
    .call({
      from: accounts[0]
    })
    .then((receipt) => {
      return web3.utils.hexToUtf8(receipt.articleUrl);
    })
    .catch((err) => {
      console.error(err)
    });
};

const getAuthors = (contract, articleHashHex) => {
  return contract.methods
    .getAuthors(articleHashHex)
    .call({
      from: accounts[0]
    })
    .then((authors) => {
      return authors;
    })
    .catch((err) => {
      console.error(err)
    });
};

const getLinkedArticles = (contract, articleHashHex) => {
  return contract.methods
    .getLinkedArticles(articleHashHex)
    .call({
      from: accounts[0]
    })
    .then((authors) => {
      return authors;
    })
    .catch((err) => {
      console.error(err)
    });
};

export default testMethod;
