import getArticleHex from '../src/backend/web3/get-articleHex.mjs';
import {
  finishMinting,
  getBalanceOf,
  mintEurekaTokens,
  submitArticle
} from '../src/backend/web3/web3-token-contract-methods.mjs';
import {
  getArticleVersion,
  getAuthors,
  getLinkedArticles,
  getSubmissionProcess,
  getUrl
  // signUpEditor
} from '../src/backend/web3/web3-platform-contract-methods.mjs';
import getAccounts from '../src/backend/web3/get-accounts.mjs';
import deployContracts from '../src/backend/web3/index.mjs';
import web3 from '../src/backend/web3/web3Instance.mjs';

let EurekaPlatformContract = undefined;
let EurekaTokenContract = undefined;
let contractOwner = undefined;
let accounts = [];

const run = async () => {
  let [eurekaTokenContract, eurekaPlatformContract] = await deployContracts();
  EurekaPlatformContract = eurekaPlatformContract;
  EurekaTokenContract = eurekaTokenContract;
  await setup(eurekaTokenContract, eurekaPlatformContract);
  testSubmitArticle();
};

const setup = async (eurekaTokenContract, eurekaPlatformContract) => {
  accounts = await getAccounts();
  contractOwner = accounts[0];
  EurekaPlatformContract = eurekaPlatformContract;
  EurekaTokenContract = eurekaTokenContract;

  const tokenAmounts = [];
  accounts.forEach(() => {
    tokenAmounts.push(20000);
  });
  await mintEurekaTokens(
    EurekaTokenContract,
    accounts,
    tokenAmounts,
    contractOwner
  );
  await finishMinting(EurekaTokenContract, contractOwner);
  console.log('The EKA token minting has been finished.');
};

// signUpEditor() on SC
// const testSignUpEditor = () => {
//   if (EurekaPlatformContract) {
//     signUpEditor(EurekaPlatformContract, contractOwner, contractOwner);
//   } else {
//     throw new Error(
//       'No setup Contract Method Tester - set it up with an adress'
//     );
//   }
// };

const testSubmitArticle = async () => {
  const article = {
    articleHash:
      '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
    url: 'hoihoi',
    // url: 'https://github.com/eureka-blockchain-solutions/eureka-platform/blob/dev/test/smartcontracts/tokencontract/submitArticle.js',
    authors: [
      '0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba88',
      '0x655aA73E526cdf45c2E8906Aafbf37d838c2Ba77'
    ],
    contributorRatios: [4000, 6000],
    linkedArticles: [
      '5f37e6ef7ee3f86aaa592bce4b142ef345c42317d6a905b0218c7241c8e30015',
      '45bc397f0d43806675ab72cc08ba6399d679c90b4baed1cbe36908cdba09986a',
      'd0d1d5e3e1d46e87e736eb85e79c905986ec77285cd415bbb213f0c24d8bcffb'
    ],
    linkedArticlesSplitRatios: [3334, 3333, 3333]
  };

  const dataInHex = getArticleHex(web3, article);
  const articleHashHex = '0x' + article.articleHash;

  const logOptions = {
    address: EurekaPlatformContract.options.address,
  };

  // let logSups = web3.eth.subscribe('logs', logOptions, function(error, result) {
  //   if (!error)
  //
  //
  //     console.log('TEST BLA');
  //   console.log(result);
  // })
  //   .on('data', function(log) {
  //     console.log('LOGS:  !!!!!!');
  //     console.log(log);
  //   })
  //   .on('changed', function(log) {
  //     console.log('LOGS CHANGED: ');
  //     console.log(log);
  //   });


  await submitArticle(
    EurekaTokenContract,
    accounts[1],
    EurekaPlatformContract.options.address,
    5000,
    dataInHex,
    8000000
  );

  console.log(
    'The balance of the service contract is ' +
    (await getBalanceOf(
      EurekaTokenContract,
      EurekaPlatformContract.options.address
    ))
  );
  console.log(
    (await getSubmissionProcess(
      EurekaPlatformContract,
      articleHashHex,
      contractOwner
    ))
  );
  console.log(
    (await getArticleVersion(
      EurekaPlatformContract,
      articleHashHex,
      contractOwner
    ))
  );
  console.log(
    'URL of the article: ' +
    (await getUrl(EurekaPlatformContract, articleHashHex, contractOwner))
  );
  console.log(
    'Authors: ' +
    (await getAuthors(EurekaPlatformContract, articleHashHex, contractOwner))
  );
  console.log(
    'Linked articles: ' +
    (await getLinkedArticles(
      EurekaPlatformContract,
      articleHashHex,
      contractOwner
    ))
  );
};

export default run();