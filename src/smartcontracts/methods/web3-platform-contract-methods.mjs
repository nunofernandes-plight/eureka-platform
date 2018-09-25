export const getContractOwner = contract => {
  return contract.methods.contractOwner().call((err, res) => {
    if (err) throw err;
    return res;
  });
};

export const signUpEditor = (contract, editor, _from) => {
  return contract.methods.signUpEditor(editor).send({
    from: _from
  });
};

export const assignForSubmissionProcess = (contract, _submissionId, _from) => {
  return contract.methods.assignForSubmissionProcess(_submissionId).send({
    from: _from
  });
};

export const removeEditorFromSubmissionProcess = (
  contract,
  _submissionId,
  _from
) => {
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

export const changeEditorFromSubmissionProcess = (
  contract,
  _submissionId,
  _newEditor,
  _from
) => {
  return contract.methods
    .changeEditorFromSubmissionProcess(_submissionId, _newEditor)
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'Changing Editor on the Submission Process with ID ' +
          _submissionId +
          ' to ' +
          _newEditor +
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
  return contract.methods.sanityIsOk(_articleHash).send({
    from: _from
  });
};

export const setSanityIsNotOk = (contract, _articleHash, _from) => {
  return contract.methods.sanityIsNotOk(_articleHash).send({
    from: _from
  });
};

export const inviteReviewersForArticle = (
  contract,
  _articleHash,
  _editorApprovedReviewers,
) => {
  return contract.methods
    .inviteReviewers(_articleHash, _editorApprovedReviewers)
};

export const getGasInviteReviewersForArticle = (
  contract,
  _articleHash,
  _editorApprovedReviewers,
  _from
) => {
  return contract.methods
    .inviteReviewers(_articleHash, _editorApprovedReviewers)
    .estimateGas({
      from: _from
    });
};

export const acceptReviewInvitation = (contract, _articleHash) => {
  return contract.methods
    .acceptReviewInvitation(_articleHash)
};

export const addEditorApprovedReview = (
  contract,
  _articleHash,
  _reviewHash,
  _articleHasMajorIssues,
  _articleHasMinorIssues,
  _score1,
  _score2
) => {
  return contract.methods
    .addEditorApprovedReview(
      _articleHash,
      _reviewHash,
      _articleHasMajorIssues,
      _articleHasMinorIssues,
      _score1,
      _score2
    )
};

export const addCommunityReview = (
  contract,
  _articleHash,
  _reviewHash,
  _articleHasMajorIssues,
  _articleHasMinorIssues,
  _score1,
  _score2
) => {
  return contract.methods
    .addCommunityReview(
      _articleHash,
      _reviewHash,
      _articleHasMajorIssues,
      _articleHasMinorIssues,
      _score1,
      _score2
    )
};

export const correctReview = (
  contract,
  _articleHash,
  _reviewHash,
  _articleHasMajorIssues,
  _articleHasMinorIssues,
  _score1,
  _score2,
  _from
) => {
  return contract.methods
    .correctReview(
      _articleHash,
      _reviewHash,
      _articleHasMajorIssues,
      _articleHasMinorIssues,
      _score1,
      _score2
    )
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'Review ' +
          _reviewHash +
          ' is corrected with the TX status: ' +
          receipt.status
      );
      return receipt;
    })
    .catch(err => {
      console.error(err);
    });
};

export const acceptReview = (
  contract,
  _articleHash,
  _reviewerAddress,
  _from
) => {
  return contract.methods
    .acceptReview(_articleHash, _reviewerAddress)
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'Review from  user ' +
          _reviewerAddress +
          ' is accepted with the TX status: ' +
          receipt.status
      );
      return receipt;
    })
    .catch(err => {
      console.error(err);
    });
};

export const declineReview = (
  contract,
  _articleHash,
  _reviewerAddress,
  _from
) => {
  return contract.methods
    .declineReview(_articleHash, _reviewerAddress)
    .send({
      from: _from
    })
    .then(receipt => {
      console.log(
        'Review from  user ' +
          _reviewerAddress +
          ' is declined with the TX status: ' +
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

export const getSubmissionProcess = async (
  contract,
  articleHashHex,
  account
) => {
  let articleVersion = await getArticleVersion(
    contract,
    articleHashHex,
    account
  );

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

export const getUrl = (web3Provider, contract, articleHashHex, account) => {
  return contract.methods
    .articleVersions(articleHashHex)
    .call({
      from: account
    })
    .then(receipt => {
      return web3Provider.utils.hexToUtf8(receipt.articleUrl);
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
