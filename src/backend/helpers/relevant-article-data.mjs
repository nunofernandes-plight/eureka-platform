export const getRelevantArticleData = (submission, articleVersion) => {
  let resArticle = {};

  resArticle.scSubmissionID = submission.scSubmissionID;
  resArticle.ownerAddress = submission.ownerAddress;
  resArticle.articleSubmissionState =
    submission.articleSubmissionState;

  resArticle._id = articleVersion._id;
  resArticle.articleHash = articleVersion.articleHash;
  resArticle.articleVersionState = articleVersion.articleVersionState;
  resArticle.updatedAt = articleVersion.updatedAt;

  resArticle.title = articleVersion.document.title;
  resArticle.authors = articleVersion.document.authors;
  resArticle.abstract = articleVersion.document.abstract;
  resArticle.figure = articleVersion.document.figure;
  resArticle.keywords = articleVersion.document.keywords;

  resArticle.editorApprovedReviews = articleVersion.editorApprovedReviews;
  resArticle.communityReviews = articleVersion.communityReviews;

  return resArticle;
};