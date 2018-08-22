import Network from './Network.js';

export const getAccounts = async web3 => {
  if (web3) {
    return web3.eth
      .getAccounts()
      .then(accounts => {
        return accounts;
      })
      .catch(err => {
        console.error('An error with getAccounts() occurred: ' + err);
        return null;
      });
  }
};

export const getBalance = async (web3, address) => {
  if (web3) {
    return web3.eth
      .getBalance(address)
      .then(balance => {
        return balance;
      })
      .catch(err =>
        console.error('An error with getBalance() occurred: ' + err)
      );
  }
};

export const getAllAccounts = async web3 => {
  let accounts = new Map();
  if (web3) {
    return web3.eth
      .getAccounts()
      .then(async addresses => {
        await Promise.all(
          addresses.map(async address => {
            const balance = await getBalance(web3, address);
            const ethBalance = web3.utils.fromWei(balance.toString());
            accounts.set(address, ethBalance);
          })
        );
        return accounts;
      })
      .catch(err => {
        console.error('An error with getAccounts() occurred: ' + err);
        return null;
      });
  }
};

export const getNetwork = async web3 => {
  if (web3) {
    const netId = await web3.eth.net.getId().then(netId => {
      return netId;
    });
    switch (netId.toString()) {
      case '1':
        console.log('Mainnet detected');
        return Network.MAIN;
      case '2':
        console.log('Morden test network detected.');
        return Network.MORDEN;
      case '3':
        console.log('Ropsten test network detected.');
        return Network.ROPSTEN;
      case '4':
        console.log('Rinkeby test network detected.');
        return Network.RINKEBY;
      case '42':
        console.log('Kovan test network detected.');
        return Network.KOVAN;
      case '5777':
        console.log('GANACHE test network detected.');
        return Network.GANACHE;
      default:
        console.log('Unknown network detected.');
        return Network.UNKNOWN;
    }
  }
};

export const signPrivateKey = async (web3, address, message) => {
  if (web3.utils.isAddress(address)) {
    return web3.eth.personal
      .sign(message, address)
      .then(signedKey => {
        return signedKey;
      })
      .catch(err => console.log(err));
  }
};

export const getArticleHex = (web3, article) => {
  let amountOfArrays = 4;
  let arrayDataStartByte = 32 + 32 + amountOfArrays * 32;

  /*
       connect the hex strings
        */
  let dataInHex =
    '0x' +
    article.articleHash +
    web3.utils.padRight(web3.utils.toHex(article.url), 64).substring(2);

  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(arrayDataStartByte), 64)
    .substring(2);
  arrayDataStartByte += 32 * (article.authors.length + 1);

  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(arrayDataStartByte), 64)
    .substring(2);
  arrayDataStartByte += 32 * (article.contributorRatios.length + 1);

  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(arrayDataStartByte), 64)
    .substring(2);
  arrayDataStartByte += 32 * (article.linkedArticles.length + 1);

  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(arrayDataStartByte), 64)
    .substring(2);
  arrayDataStartByte += 32 * (article.linkedArticlesSplitRatios.length + 1);

  //authors address
  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(article.authors.length), 64)
    .substring(2);
  article.authors.forEach(address => {
    dataInHex += web3.utils.padLeft(address, 64).substring(2);
  });

  //contributorRatio
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

  //linked articles split ratio
  dataInHex += web3.utils
    .padLeft(web3.utils.toHex(article.linkedArticlesSplitRatios.length), 64)
    .substring(2);
  article.linkedArticlesSplitRatios.forEach(ratio => {
    dataInHex += web3.utils.padLeft(web3.utils.toHex(ratio), 64).substring(2);
  });

  console.log('Article data hex string: ' + dataInHex);

  return dataInHex;
};
