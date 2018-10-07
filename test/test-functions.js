import {
  signUpEditor,
  assignForSubmissionProcess,
  changeEditorFromSubmissionProcess,
  removeEditorFromSubmissionProcess,
  setSanityToOk,
  setSanityIsNotOk,
  inviteReviewersForArticle,
  acceptReviewInvitation,
  addEditorApprovedReview,
  addCommunityReview,
  acceptReview,
  declineReview,
  acceptArticleVersion,
  declineArticleVersion,
  openNewReviewRound,
  declineNewReviewRound
} from '../src/smartcontracts/methods/web3-platform-contract-methods.mjs';
import userService from '../src/backend/db/user-service.mjs';
import Roles from '../src/backend/schema/roles-enum.mjs';
import {sleepSync} from './helpers.js';
import articleSubmissionService from '../src/backend/db/article-submission-service.mjs';
import ArticleVersionState from '../src/backend/schema/article-version-state-enum.mjs';
import articleVersionService from '../src/backend/db/article-version-service.mjs';
import {submitArticle} from '../src/smartcontracts/methods/web3-token-contract-methods.mjs';
import reviewService from '../src/backend/db/review-service.mjs';
import ReviewState from '../src/backend/schema/review-state-enum.mjs';

let eurekaPlatformContract;
let eurekaTokenContract;
let contractOwner;

export default {
  setContractsForTestingFunctions: function(_eurekaPlatformContract, _eurekaTokenContract, _contractOwnerAddress) {
    eurekaPlatformContract = _eurekaPlatformContract;
    eurekaTokenContract = _eurekaTokenContract;
    contractOwner = _contractOwnerAddress;
  },

  /**
   *  Signs up the provided user as an Editor on the SC.
   *  Afterwards checks if the user has become an Editor on the DB as well
   * @param t
   * @param user
   * @returns {Promise<*>}
   */
  signUpEditorAndTest: async function(t, user) {
    const rolesLength = user.roles.length;
    const scTransactionLength = user.scTransactions.length;
    let dbUser = await userService.getUserByEthereumAddress(user.ethereumAddress);
    t.is(true, true);

    t.is(dbUser.roles.includes(Roles.EDITOR), false);
    await signUpEditor(eurekaPlatformContract, user.ethereumAddress).send({
      from: contractOwner
    });

    dbUser = await userService.getUserByEthereumAddressWithScTransactions(
      user.ethereumAddress
    );

    let counter = 0;
    while (dbUser.scTransactions.length < scTransactionLength && counter < 5) {
      sleepSync(5000);
      dbUser = await userService.getUserByEthereumAddressWithScTransactions(
        contractOwner
      );
      counter++;
    }
    t.is(dbUser.roles.length, rolesLength + 1);
    t.is(dbUser.roles[rolesLength], Roles.EDITOR);
    return t;
  },

  /**
   * Create an articleDraft on the DB and submit it afterward to the SC.
   * Test if the articleVersion has Status 'SUBMITTED' at the end.
   * @param t
   * @param user
   * @param articleHashHex
   * @param articleDataInHex
   * @returns {Promise<*>}
   */
  createArticleDraftAndSubmitIt: async function(t, user, articleHashHex, articleDataInHex) {
    // Create an article-draft on DB
    const articleSubmissionslength = (await articleSubmissionService.getAllSubmissions()).length;
    await articleSubmissionService.createSubmission(user.ethereumAddress);
    let articleSubmission = (await articleSubmissionService.getAllSubmissions())[articleSubmissionslength];

    t.is(articleSubmission.articleVersions.length, 1);
    let articleVersion = articleSubmission.articleVersions[0];
    t.is(articleVersion.articleVersionState, ArticleVersionState.DRAFT);

    // Send articleHash to DB
    await articleVersionService.finishDraftById(
      user.ethereumAddress,
      articleVersion._id,
      articleHashHex
    );

    articleVersion = await articleVersionService.getArticleVersionById(
      user.ethereumAddress,
      articleVersion._id
    );
    t.is(
      articleVersion.articleVersionState,
      ArticleVersionState.FINISHED_DRAFT
    );
    t.is(articleVersion.articleHash, articleHashHex);


    // Submit articleHash on SC
    await submitArticle(
      eurekaTokenContract,
      eurekaPlatformContract.options.address,
      5000,
      articleDataInHex
    ).send({
      from: user.ethereumAddress,
      gas: 80000000
    });

    articleVersion = await articleVersionService.getArticleVersionById(
      user.ethereumAddress,
      articleVersion._id
    );
    let counter = 0;
    while (articleVersion.articleVersionState === ArticleVersionState.FINISHED_DRAFT && counter < 5) {
      sleepSync(5000);
      articleVersion = await articleVersionService.getArticleVersionById(
        user.ethereumAddress,
        articleVersion._id
      );
      counter++;
    }
    t.is(articleVersion.articleVersionState, ArticleVersionState.SUBMITTED);

    // test if submission exist
    articleSubmission = (await articleSubmissionService.getAllSubmissions())[articleSubmissionslength];
    counter = 0;
    while (!articleSubmission && counter < 5) {
      sleepSync(5000);
      articleSubmission = (await articleSubmissionService.getAllSubmissions())[articleSubmissionslength];
      counter++;
    }

    // test if scSubmissionID is on DB
    counter = 0;
    while (articleSubmission.scSubmissionID !== articleSubmissionslength && counter < 5) {
      sleepSync(5000);
      articleSubmission = (await articleSubmissionService.getAllSubmissions())[articleSubmissionslength];
      counter++;
    }

    t.is(articleSubmission.scSubmissionID, articleSubmissionslength);
    return t;
  },

  /**
   * Assigns the editor provided on the articleSubmission.
   * Works only of the ethereumAddress of the editor is assigned as editor
   * in the SC
   * @param t
   * @param editor
   * @param articleSubmission
   * @returns {Promise<void>}
   */
  assignEditorForSubmissionProcess: async function(t, editor, articleSubmission) {
    await assignForSubmissionProcess(
      eurekaPlatformContract,
      articleSubmission.scSubmissionID
    ).send({
      from: editor.ethereumAddress
    });
    articleSubmission = await articleSubmissionService.getSubmissionById(
      articleSubmission._id
    );
    t.is(articleSubmission.editor, editor.ethereumAddress);
    return t;
  },

  /**
   * Change the editor for a submission process.
   * Only the contractowner or the editor already assigned to the submission
   * is allowed to do this.
   * Here it is always tested by the contract owner
   * @param t
   * @param newEditor
   * @param articleSubmission
   * @returns {Promise<*>}
   */
  changeEditorForSubmissionProcess: async function(t, newEditor, articleSubmission) {
    await changeEditorFromSubmissionProcess(
      eurekaPlatformContract,
      articleSubmission.scSubmissionID,
      newEditor.ethereumAddress
    ).send({
      from: contractOwner
    });
    articleSubmission = await articleSubmissionService.getSubmissionById(
      articleSubmission._id
    );
    t.is(articleSubmission.editor, newEditor.ethereumAddress);
    return t;
  },

  /**
   * Remove a preassigned editor from the submission.
   * Leave the editor as value null afterwards
   * @param t
   * @param editor
   * @param articleSubmission
   * @returns {Promise<void>}
   */
  removeEditorFromSubmissionProcessAndTest: async function(t, editor, articleSubmission) {
    await removeEditorFromSubmissionProcess(
      eurekaPlatformContract,
      articleSubmission.scSubmissionID
    ).send({
      from: editor.ethereumAddress
    });
    let dbArticleSubmission = await articleSubmissionService.getSubmissionById(
      articleSubmission._id
    );
    t.is(dbArticleSubmission.editor, null);
  },

  acceptSanityCheckAndTest: async function(t, editor, author, articleVersion) {
    await setSanityToOk(eurekaPlatformContract, articleVersion.articleHash).send({
      from: editor.ethereumAddress
    });

    let dbArticleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );

    let counter = 0;
    while (
      articleVersion.articleVersionState !==
      ArticleVersionState.EDITOR_CHECKED &&
      counter < 5) {
      sleepSync(5000);
      dbArticleVersion = await articleVersionService.getArticleVersionById(
        author.ethereumAddress,
        articleVersion._id
      );
      counter++;
    }
    t.is(dbArticleVersion.articleVersionState, ArticleVersionState.EDITOR_CHECKED);
  },

  declineSanityCheckAndTest: async function(t, editor, author, articleVersion) {
    await setSanityIsNotOk(
      eurekaPlatformContract,
      articleVersion.articleHash
    ).send({
      from: editor.ethereumAddress
    });
    let dbArticleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );

    let counter = 0;
    while (
      articleVersion.articleVersionState !==
      ArticleVersionState.DECLINED_SANITY_NOTOK &&
      counter < 5) {
      sleepSync(5000);
      dbArticleVersion = await articleVersionService.getArticleVersionById(
        author.ethereumAddress,
        articleVersion._id
      );
      counter++;
      t.is(dbArticleVersion.articleVersionState, ArticleVersionState.DECLINED_SANITY_NOTOK);
    }
  },

  /**
   * Invite all the users coming in an array for
   * becoming a reviewer of the articleVersion submitted.
   * @param t
   * @param editor
   * @param author
   * @param reviewers is an array of users, which should become reviewers
   * @param articleVersion
   * @returns {Promise<void>}
   */
  inviteReviewersAndTest: async function(t, editor, author, reviewers, articleVersion) {
    const existingReviewersLength = articleVersion.editorApprovedReviews.length;
    const newReviewersLength = reviewers.length;

    const reviewersAddress = reviewers.map(reviewer => {
      return reviewer.ethereumAddress;
    });

    await inviteReviewersForArticle(
      eurekaPlatformContract,
      articleVersion.articleHash,
      reviewersAddress
    ).send({
      from: editor.ethereumAddress,
      gas: 80000000
    });

    let dbArticleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );
    // Check if article-version in DB holds reviewers
    let counter = 0;
    while (dbArticleVersion.editorApprovedReviews.length < 3 && counter < 5) {
      sleepSync(5000);
      dbArticleVersion = await articleVersionService.getArticleVersionById(
        author.ethereumAddress,
        articleVersion._id
      );
      counter++;
    }
    t.is(dbArticleVersion.editorApprovedReviews.length, (existingReviewersLength + newReviewersLength));
  },

  /**
   * Accepts the invitation to become editor-approved reviewer
   * @param t
   * @param reviewer that has been invited before by the editor
   * @param index position within the editorApprovedReviews, the review here should be updated after the call
   * @param articleVersion
   * @returns {Promise<void>}
   */
  acceptInvitationAndTest: async function(t, reviewer, index, articleVersion) {
    await acceptReviewInvitation(
      eurekaPlatformContract,
      articleVersion.articleHash
    ).send({
      from: reviewer.ethereumAddress,
      gas: 80000000
    });

    let dbReview = await reviewService.getReviewById(
      reviewer.ethereumAddress,
      articleVersion.editorApprovedReviews[index]
    );

    let counter = 0;
    while (
      dbReview.reviewState !== ReviewState.INVITATION_ACCEPTED &&
      counter < 5){
      sleepSync(5000);
      dbReview = await reviewService.getReviewById(
        reviewer.ethereumAddress,
        articleVersion.editorApprovedReviews[index]
      );
      counter++;
    }
    t.is(dbReview.reviewState, ReviewState.INVITATION_ACCEPTED);
  },

  addEditorApprovedReviewAndTest: async function(t, reviewer, review, reviewData, reviewDataInHex, articleVersion) {
    // Add editor-approved review1 into DB
    await reviewService.addEditorApprovedReview(
      reviewer.ethereumAddress,
      review._id,
      reviewData.reviewText,
      reviewDataInHex,
      reviewData.score1,
      reviewData.score2,
      reviewData.articleHasMajorIssues,
      reviewData.articleHasMinorIssues
    );

    let dbReview = await reviewService.getReviewById(
      reviewer.ethereumAddress,
      review._id
    );
    t.is(dbReview.reviewState, ReviewState.HANDED_IN_DB);

    // Add review1 in SC
    await addEditorApprovedReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      reviewDataInHex,
      reviewData.articleHasMajorIssues,
      reviewData.articleHasMinorIssues,
      reviewData.score1,
      reviewData.score2
    ).send({
      from: reviewer.ethereumAddress,
      gas: 80000000
    });

    // Check if status changed on DB
    dbReview = await reviewService.getReviewById(
      reviewer.ethereumAddress,
      review._id
    );
    let counter = 0;
    while (review.reviewState !== ReviewState.HANDED_IN_SC && counter < 5) {
      sleepSync(5000);
      dbReview = await reviewService.getReviewById(
        reviewer.ethereumAddress,
        review._id
      );
      counter++;
    }
    t.is(dbReview.reviewState, ReviewState.HANDED_IN_SC);
  },

  addNewCommunitydReviewAndTest: async function(t, reviewer, reviewData, reviewDataInHex, author, articleVersion) {
    const existingCommunityReviewsLength = articleVersion.communityReviews.length;

    // Add a new communityReview into the DB
    let dbReview = await reviewService.addNewCommunitydReview(
      reviewer.ethereumAddress,
      articleVersion.articleHash,
      reviewData.reviewText,
      reviewDataInHex,
      reviewData.score1,
      reviewData.score2,
      reviewData.articleHasMajorIssues,
      reviewData.articleHasMinorIssues
    );

    // check if community review has been added and status has changed on DB
    articleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );
    t.is(articleVersion.communityReviews.length, (existingCommunityReviewsLength + 1));
    dbReview = await reviewService.getReviewById(
      reviewer.ethereumAddress,
      dbReview._id
    );
    t.is(dbReview.reviewState, ReviewState.HANDED_IN_DB);

    // Add the communityReview into the SC
    await addCommunityReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      reviewDataInHex,
      reviewData.articleHasMajorIssues,
      reviewData.articleHasMinorIssues,
      reviewData.score1,
      reviewData.score2
    ).send({
      from: reviewer.ethereumAddress,
      gas: 80000000
    });

    // check if status on DB has changed from SC Event
    dbReview = await reviewService.getReviewById(
      reviewer.ethereumAddress,
      dbReview._id
    );
    let counter = 0;
    while (dbReview.reviewState !== ReviewState.HANDED_IN_SC && counter < 10) {
      sleepSync(5000);
      dbReview = await reviewService.getReviewById(
        reviewer.ethereumAddress,
        dbReview._id
      );
      counter++;
    }
    t.is(dbReview.reviewState, ReviewState.HANDED_IN_SC);
  },

  acceptReviewAndTest: async function(t, editor, review, articleVersion) {
    await acceptReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      review.reviewerAddress
    ).send({
      from: editor.ethereumAddress
    });

    let dbReview = await reviewService.getReviewById(
      review.reviewerAddress,
      review._id
    );

    let counter = 0;
    while (review.reviewState !== ReviewState.ACCEPTED && counter < 10) {
      sleepSync(5000);
      dbReview = await reviewService.getReviewById(
        review.reviewerAddress,
        review._id
      );
      counter++;
    }
    t.is(dbReview.reviewState, ReviewState.ACCEPTED);
  },

  declineReviewAndTest: async function(t, editor, review, articleVersion) {
    await declineReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      review.reviewerAddress
    ).send({
      from: editor.ethereumAddress
    });

    let dbReview = await reviewService.getReviewById(
      review.reviewerAddress,
      review._id
    );

    let counter = 0;
    while (review.reviewState !== ReviewState.ACCEPTED && counter < 10) {
      sleepSync(5000);
      dbReview = await reviewService.getReviewById(
        review.reviewerAddress,
        review._id
      );
      counter++;
    }
    t.is(dbReview.reviewState, ReviewState.DECLINED);
  },

  acceptArticleVersionAndTest: async function(t, editor, articleVersion) {
    await acceptArticleVersion(
      eurekaPlatformContract,
      articleVersion.articleHash
    ).send({
      from: editor.ethereumAddress
    });
    let dbArticleVersion = await articleVersionService.getArticleVersionById(articleVersion.ownerAddress, articleVersion._id);
    let counter = 0;
    while (dbArticleVersion.articleVersionState !== ArticleVersionState.ACCEPTED && counter < 5) {
      sleepSync(5000);
      dbArticleVersion = await articleVersionService.getArticleVersionById(articleVersion.ownerAddress, articleVersion._id);
      counter++;
    }
    t.is(dbArticleVersion.articleVersionState, ArticleVersionState.ACCEPTED);
  },

  declineArticleVersionAndTest: async function(t, editor, articleVersion) {
    await declineArticleVersion(
      eurekaPlatformContract,
      articleVersion.articleHash
    ).send({
      from: editor.ethereumAddress
    });
    let dbArticleVersion = await articleVersionService.getArticleVersionById(articleVersion.ownerAddress, articleVersion._id);
    let counter = 0;
    while (dbArticleVersion.articleVersionState !== ArticleVersionState.DECLINED && counter < 5) {
      sleepSync(5000);
      dbArticleVersion = await articleVersionService.getArticleVersionById(articleVersion.ownerAddress, articleVersion._id);
      counter++;
    }
    t.is(dbArticleVersion.articleVersionState, ArticleVersionState.DECLINED);
  },

  openNewReviewRoundAndTest: async function(t, submissionOwner, scSubmissionId, articleVersion, articleVersionData, articleHash, urlHash) {
    await openNewReviewRound(
      eurekaPlatformContract, scSubmissionId, articleHash, urlHash,
      articleVersionData.authors, articleVersionData.contributorRatios, articleVersionData.linkedArticles, articleVersionData.linkedArticlesSplitRatios
    ).send({
      from: submissionOwner.ethereumAddress
    });

    let dbArticleSubmission = await articleSubmissionService.getSubmissionBySCsubmissionId(scSubmissionId);
    let dbArticleVersion = await articleVersionService.getArticleVersionById(submissionOwner.ethereumAddress,
      dbArticleSubmission.articleVersions[dbArticleSubmission.articleVersions.length-1]);

    let counter = 0;
    while (dbArticleVersion.articleVersionState !== ArticleVersionState.SUBMITTED && counter < 5) {
      sleepSync(5000);
      dbArticleVersion = await articleVersionService.getArticleVersionById(submissionOwner.ethereumAddress, dbArticleVersion._id);
      counter++;
    }
    t.is(dbArticleVersion.articleVersionState, ArticleVersionState.SUBMITTED);
  },

  declineNewReviewRoundAndTest: async function(t, scSubmissionId, submissionOwner) {
    await declineNewReviewRound(
      eurekaPlatformContract, scSubmissionId
    ).send({
      from: submissionOwner.ethereumAddress
    });

  }
};