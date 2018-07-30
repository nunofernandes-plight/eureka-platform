import web3 from './web3Instance.mjs';

export const signUpEditor = (contract, editor, _from) => {
  return contract.methods
    .signUpEditor(editor)
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'The editor sign up for account ' +
          editor +
          ' exited with the TX status: ' +
          receipt.status
      );
      return receipt;
    })
    .catch(err => {
      console.error(err);
    });
};

/*
  Getters
 */

export const getUrl = (contract, articleHashHex, account) => {
  return contract.methods
    .articleVersions(articleHashHex)
    .call({
      from: account
    })
    .then(receipt => {
      return web3.utils.hexToUtf8(receipt.articleUrl);
    })
    .catch(err => {
      console.error(err);
    });
};

export const getAuthors = (contract, articleHashHex, account) => {
  return contract.methods
    .getAuthors(articleHashHex)
    .call({
      from: account
    })
    .then(authors => {
      return authors;
    })
    .catch(err => {
      console.error(err);
    });
};

export const getLinkedArticles = (contract, articleHashHex, account) => {
  return contract.methods
    .getLinkedArticles(articleHashHex)
    .call({
      from: account
    })
    .then(authors => {
      return authors;
    })
    .catch(err => {
      console.error(err);
    });
};
