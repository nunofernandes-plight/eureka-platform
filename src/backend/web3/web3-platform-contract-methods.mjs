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

export const assignForSubmissionProcess = (contract, _submissionId, _from) => {
  return contract.methods
    .assignForSubmissionProcess(_submissionId)
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'The assignement on the Submission Process with ID ' +
        _submissionId +
        ' exited with the TX status: ' +
        receipt.status
      );
      return receipt;
    })
    .catch(err => {
      console.error(err);
    });
};

export const removeEditorFromSubmissionProcess = (contract, _submissionId, _from) => {
  console.log(_from);
  return contract.methods
    .removeEditorFromSubmissionProcess(_submissionId)
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'Removement of Editor on the Submission Process with ID ' +
        _submissionId +
        ' exited with the TX status: ' +
        receipt.status
      );
      return receipt;
    })
    .catch( err => {
      console.log('TTEEESTING IS NOT WORKING HEEEERE!!!');
      console.error(err);
    });
};
/*
  Getters
 */

export const getSubmissionProcess = async (contract, articleHashHex, account) => {

  let articleVersion = await getArticleVersion(contract, articleHashHex, account);

  return contract.methods
    .articleSubmissions(articleVersion.submissionId)
    .call({
      from: account
    })
    .then(process => {
      return process;
    })
    .catch(err => {
      console.error(err);
    });
};

export const getArticleVersion = (contract, articleHashHex, account) => {
  return contract.methods
    .articleVersions(articleHashHex)
    .call({
      from: account
    })
    .then(articleVersion => {
      return articleVersion;
    })
    .catch(err => {
      console.error(err);
    });
};

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
