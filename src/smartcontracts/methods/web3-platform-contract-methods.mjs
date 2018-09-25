export const signUpEditor = (contract, editor) => {
  return contract.methods.signUpEditor(editor);
};

export const assignForSubmissionProcess = (contract, _submissionId) => {
  return contract.methods.assignForSubmissionProcess(_submissionId);
};

export const removeEditorFromSubmissionProcess = (
  contract,
  _submissionId
) => {
  return contract.methods
    .removeEditorFromSubmissionProcess(_submissionId);
};

export const changeEditorFromSubmissionProcess = (
  contract,
  _submissionId,
  _newEditor
) => {
  return contract.methods
    .changeEditorFromSubmissionProcess(_submissionId, _newEditor);
};

export const setSanityToOk = (contract, _articleHash) => {
  return contract.methods.sanityIsOk(_articleHash);
};

export const setSanityIsNotOk = (contract, _articleHash, _from) => {
  return contract.methods.sanityIsNotOk(_articleHash).send({
    from: _from
  });
};

export const inviteReviewersForArticle = (
  contract,
  _articleHash,
  _editorApprovedReviewers
) => {
  return contract.methods.inviteReviewers(
    _articleHash,
    _editorApprovedReviewers
  );
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
  return contract.methods.acceptReviewInvitation(_articleHash);
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
  return contract.methods.addEditorApprovedReview(
    _articleHash,
    _reviewHash,
    _articleHasMajorIssues,
    _articleHasMinorIssues,
    _score1,
    _score2
  );
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
  return contract.methods.addCommunityReview(
    _articleHash,
    _reviewHash,
    _articleHasMajorIssues,
    _articleHasMinorIssues,
    _score1,
    _score2
  );
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

export const getContractOwner = contract => {
  return contract.methods.contractOwner().call((err, res) => {
    if (err) throw err;
    return res;
  });
};

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
  return contract.methods.articleSubmissions(articleVersion.submissionId).call({
    from: account
  });
};

export const getArticleVersion = (contract, articleHashHex, account) => {
  return contract.methods.articleVersions(articleHashHex).call({
    from: account
  });
};

export const getUrl = (web3Provider, contract, articleHashHex, account) => {
  return contract.methods.articleVersions(articleHashHex).call({
    from: account
  });
};

export const getAuthors = (contract, articleHashHex, account) => {
  return contract.methods.getAuthors(articleHashHex).call({
    from: account
  });
};

export const getLinkedArticles = (contract, articleHashHex, account) => {
  return contract.methods.getLinkedArticles(articleHashHex).call({
    from: account
  });
};
