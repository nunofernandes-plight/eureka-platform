import {
  mintEurekaTokens,
  finishMinting,
  submitArticle,
  getBalanceOf
} from '../../src/backend/web3/web3-token-contract-methods.mjs';
import {
  getAuthors,
  getLinkedArticles,
  getUrl,
  signUpEditor
} from '../../src/backend/web3/web3-platform-contract-methods.mjs';
import getArticleHex from '../../src/backend/web3/get-articleHex';
import getAccounts from '../../src/backend/web3/get-accounts.mjs';
import User from '../../src/backend/schema/user';
import userService from '../../src/backend/db/user-service';

let EurekaPlatformContract = undefined;
let EurekaTokenContract = undefined;
let contractOwner = undefined;
let accounts = [];

export default {
  setup: async (eurekaTokenContract, eurekaPlatformContract) => {
    accounts = await getAccounts();
    contractOwner = accounts[0];
    EurekaPlatformContract = eurekaPlatformContract;
    EurekaTokenContract = eurekaTokenContract;

    //setup DB
    let user = await User.remove({});
    await userService.createUser('test2', 'test', 'test@test.test', contractOwner);

    let tokenAmounts = [];
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

    return user;
  },

  // signUpEditor() on SC
  testSignUpEditor: () => {
    if (EurekaPlatformContract) {
      signUpEditor(EurekaPlatformContract, contractOwner, contractOwner);
    } else {
      throw new Error(
        'No setup Contract Method Tester - set it up with an adress'
      );
    }
  },

  testSubmitArticle: async () => {
    let article = {
      articleHash:
        '449ee57a8c6519e1592af5f292212c620bbf25df787d25b55e47348a54d0f9c7',
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

    let dataInHex = getArticleHex(article);
    let articleHashHex = '0x' + article.articleHash;

    await submitArticle(
      EurekaTokenContract,
      contractOwner,
      EurekaPlatformContract.options.address,
      5000,
      dataInHex
    );

    console.log(
      'The balance of the service contract is ' +
        (await getBalanceOf(
          EurekaTokenContract,
          EurekaPlatformContract.options.address
        ))
    );
    console.log(
      'URL of the article: ' +
        (await getUrl(EurekaPlatformContract, articleHashHex, contractOwner))
    );
    console.log(
      'Authors: ' +
        (await getAuthors(
          EurekaPlatformContract,
          articleHashHex,
          contractOwner
        ))
    );
    console.log(
      'Linked articles: ' +
        (await getLinkedArticles(
          EurekaPlatformContract,
          articleHashHex,
          contractOwner
        ))
    );
  }
};
