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
    .catch(err => {
      console.error(err);
    });
};

export const changeEditorFromSubmissionProcess = (contract, _submissionId, _newEditor, _from) => {
  return contract.methods
    .changeEditorFromSubmissionProcess(_submissionId, _newEditor)
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'Changing Editor on the Submission Process with ID ' +
        _submissionId +
        ' to ' + _newEditor +
        ' exited with the TX status: ' +
        receipt.status
      );
      return receipt;
    })
    .catch(err => {
      console.error(err);
    });
};

export const setSanityToOk = (contract, _articleHash, _from) => {
  return contract.methods
    .sanityIsOk(_articleHash)
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'Sanity check for Article ' +
        _articleHash +
        ' is got accepted with the TX status: ' +
        receipt.status
      );
      return receipt;
    })
    .catch(err => {
      console.error(err);
    });
};

export const setSanityIsNotOk = (contract, _articleHash, _from) => {
  return contract.methods
    .sanityIsNotOk(_articleHash)
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'Sanity check for Article ' +
        _articleHash +
        ' is got declined with the TX status: ' +
        receipt.status
      );
      return receipt;
    })
    .catch(err => {
      console.error(err);
    });
};

export const inviteReviewersForArticle = (contract, _articleHash, _editorApprovedReviewers, _from) => {
  return contract.methods
    .inviteReviewers(_articleHash, _editorApprovedReviewers)
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'Invitation for Reviewers on' +
        _articleHash +
        ' is sent out with the TX status: ' +
        receipt.status
      );
      return receipt;
    })
    .catch(err => {
      console.error(err);
    });
};

export const acceptReviewerInvitation = (contract, _articleHash, _from) => {
  return contract.methods
    .acceptReviewInvitation(_articleHash)
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'Acception for ReviewInvitation on article ' +
        _articleHash +
        ' is sent out with the TX status: ' +
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
