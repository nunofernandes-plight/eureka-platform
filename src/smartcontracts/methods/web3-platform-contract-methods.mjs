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

export const setSanityIsNotOk = (contract, _articleHash) => {
  return contract.methods.sanityIsNotOk(_articleHash);
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
  _score2
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
};

export const acceptReview = (
  contract,
  _articleHash,
  _reviewerAddress
) => {
  return contract.methods
    .acceptReview(_articleHash, _reviewerAddress);
};

export const declineReview = (
  contract,
  _articleHash,
  _reviewerAddress
) => {
  return contract.methods
    .declineReview(_articleHash, _reviewerAddress);
};

export const acceptArticleVersion = (
  contract,
  _articleHash,
) => {
  return contract.methods
    .acceptArticleVersion(_articleHash);
};

export const declineArticleVersion = (
  contract,
  _articleHash,
) => {
  return contract.methods
    .declineArticleVersion(_articleHash);
};

export const openNewReviewRound = (
  contract,
  _submissionId,
  _articleHash,
  _articleUrl,
  _authors,
  _authorsContributionRations,
  _linkedArticles,
  _linkedArticlesSplitRatios
) => {
  return contract.methods
    .openNewReviewRound(_submissionId, _articleHash, _articleUrl, _authors,
      _authorsContributionRations, _linkedArticles, _linkedArticlesSplitRatios);
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
