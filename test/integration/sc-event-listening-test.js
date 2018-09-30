import {
  acceptArticleVersion,
  signUpEditor
} from '../../src/smartcontracts/methods/web3-platform-contract-methods.mjs';
import {submitArticle} from '../../src/smartcontracts/methods/web3-token-contract-methods.mjs';
import test from 'ava';
import app from '../../src/backend/api/api.mjs';
import getAccounts from '../../src/smartcontracts/methods/get-accounts.mjs';
import ArticleVersionState from '../../src/backend/schema/article-version-state-enum.mjs';
import ScTransactionType from '../../src/backend/schema/sc-transaction-state-enum.mjs';
import ReviewState from '../../src/backend/schema/review-state-enum.mjs';
import userService from '../../src/backend/db/user-service.mjs';
import articleSubmissionService from '../../src/backend/db/article-submission-service.mjs';
import articleVersionService from '../../src/backend/db/article-version-service.mjs';
import reviewService from '../../src/backend/db/review-service.mjs';
import {cleanDB} from '../helpers.js';
import {
  assignForSubmissionProcess,
  removeEditorFromSubmissionProcess,
  changeEditorFromSubmissionProcess,
  setSanityToOk,
  setSanityIsNotOk,
  inviteReviewersForArticle,
  acceptReviewInvitation,
  addEditorApprovedReview,
  addCommunityReview,
  acceptReview,
  declineReview
} from '../../src/smartcontracts/methods/web3-platform-contract-methods.mjs';
import {sleepSync} from '../helpers.js';
import Roles from '../../src/backend/schema/roles-enum.mjs';
import web3 from '../../src/helpers/web3Instance.mjs';
import dotenv from 'dotenv';
import {setupWeb3Interface} from '../../src/backend/web3/web3InterfaceSetup.mjs';
import {deploy} from '../../src/smartcontracts/deployment/deployer-and-mint.mjs';
import {
  TEST_ARTICLE_1_DATA_IN_HEX,
  TEST_ARTICLE_1_HASH_HEX,
  TEST_ARTICLE_2_DATA_IN_HEX,
  TEST_ARTICLE_2_HASH_HEX,
  REVIEW_1,
  REVIEW_1_HASH_HEX,
  REVIEW_2,
  REVIEW_2_HASH_HEX,
  REVIEW_3,
  REVIEW_3_HASH_HEX,
  REVIEW_4,
  REVIEW_4_HASH_HEX,
  createUserContractOwner,
  setAccounts,
  createUser1, createEditor1, createEditor2, createReviewer1, createReviewer2, createReviewer3, createReviewer4
} from '../test-data';
import TestFunctions from '../test-functions';

let eurekaTokenContract;
let eurekaPlatformContract;
let accounts;
let contractOwner;

const PRETEXT = 'INTEGRATION: ';
/** ************** TESTING ****************/

test.before(async () => {
  accounts = await getAccounts(web3);
  setAccounts(accounts);
  contractOwner = accounts[0];
  await dotenv.config();

  await app.setupApp();
  await app.listenTo(process.env.PORT || 8080);
});

test.beforeEach(async () => {
  await cleanDB();
  let [tokenContract, platformContract] = await deploy();
  await setupWeb3Interface(platformContract, tokenContract);
  eurekaPlatformContract = platformContract;
  eurekaTokenContract = tokenContract;
  TestFunctions.setContractsForTestingFunctions(eurekaPlatformContract, eurekaTokenContract);
});

test.after(async () => {
  await app.close();
});

/************************ Sign up Editor ************************/
test(PRETEXT + 'Sign up Editor', async t => {
  let user = await createUserContractOwner();
  t.is(user.roles.length, 1);
  t.is(user.roles[0], Roles.CONTRACT_OWNER);

  await TestFunctions.signUpEditorAndTest(t, user);
});


/************************ Submit an Article &  auto change of Status from DRAFT --> SUBMITTED ************************/
test(
  PRETEXT +
  'Submit an Article &  auto change of Status from DRAFT --> SUBMITTED',
  async t => {
    // Create user on DB
    t.is((await userService.getAllUsers()).length, 0);
    await createUserContractOwner();
    const user1 = await createUser1();
    t.is((await userService.getAllUsers()).length, 2);

    await TestFunctions.createArticleDraftAndSubmitIt(t, user1, TEST_ARTICLE_1_HASH_HEX, TEST_ARTICLE_1_DATA_IN_HEX);
  }
);

test(
  PRETEXT + 'Assignment, Change and Remove of Editor for Submission Process',
  async t => {
    // Create author and editor 1 & 2
    const author = await createUserContractOwner();
    const editor = await createEditor1();
    const editor2 = await createEditor2();

    // Sign up editor1 & 2
    await TestFunctions.signUpEditorAndTest(t, editor);
    await TestFunctions.signUpEditorAndTest(t, editor2);

    // Submit article
    await TestFunctions.createArticleDraftAndSubmitIt(t, author, TEST_ARTICLE_1_HASH_HEX, TEST_ARTICLE_1_DATA_IN_HEX);
    let articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];

    // Assign first editor for submission process
    await TestFunctions.assignEditorForSubmissionProcess(t, editor, articleSubmission);
    // Change to second editor for submission process
    await TestFunctions.changeEditorForSubmissionProcess(t, editor2, articleSubmission);

    await TestFunctions.removeEditorFromSubmissionProcessAndTest(t, editor2, articleSubmission);
  }
);

test.only(PRETEXT + 'Submission of article, Sanity-Check', async t => {
  // Create author and editor
  const author = await createUserContractOwner();
  const editor = await createEditor1();

  // Setup article draft 1 & 2


  await articleSubmissionService.createSubmission(author.ethereumAddress);
  let articleSubmission1 = (await articleSubmissionService.getAllSubmissions())[0];
  let articleVersion1 = articleSubmission1.articleVersions[0];
  await articleVersionService.finishDraftById(
    author.ethereumAddress,
    articleVersion1._id,
    TEST_ARTICLE_1_HASH_HEX
  );

  await articleSubmissionService.createSubmission(author.ethereumAddress);
  let articleSubmission2 = (await articleSubmissionService.getAllSubmissions())[1];
  let articleVersion2 = articleSubmission2.articleVersions[0];
  await articleVersionService.finishDraftById(
    author.ethereumAddress,
    articleVersion2._id,
    TEST_ARTICLE_2_HASH_HEX
  );

  // Signup editor and submit article 1 & 2
  await signUpEditor(eurekaPlatformContract, editor.ethereumAddress).send({
    from: contractOwner
  });
  await submitArticle(
    eurekaTokenContract,
    eurekaPlatformContract.options.address,
    5000,
    TEST_ARTICLE_1_DATA_IN_HEX
  ).send({
    from: author.ethereumAddress,
    gas: 80000000
  });
  await submitArticle(
    eurekaTokenContract,
    eurekaPlatformContract.options.address,
    5000,
    TEST_ARTICLE_2_DATA_IN_HEX
  ).send({
    from: author.ethereumAddress,
    gas: 80000000
  });

  let articleSubmissions = await articleSubmissionService.getAllSubmissions();
  t.is(articleSubmissions.length, 2);

  let counter = 0;
  while (
    (typeof articleSubmissions[0].scSubmissionID === 'undefined' ||
      typeof articleSubmissions[1].scSubmissionID === 'undefined') &&
    counter < 10
  ) {
    sleepSync(5000);
    articleSubmissions = await articleSubmissionService.getAllSubmissions();
    counter++;
  }

  // TODO try sanity check without being assign first --> expected behavior: must fail
  // assign editor for the submission process of article 1 & 2
  await assignForSubmissionProcess(
    eurekaPlatformContract,
    articleSubmissions[0].scSubmissionID
  ).send({
    from: editor.ethereumAddress
  });
  articleSubmission1 = await articleSubmissionService.getSubmissionById(
    articleSubmissions[0]._id
  );
  t.is(articleSubmission1.editor, editor.ethereumAddress);

  await assignForSubmissionProcess(
    eurekaPlatformContract,
    articleSubmissions[1].scSubmissionID
  ).send({
    from: editor.ethereumAddress
  });
  articleSubmission2 = await articleSubmissionService.getSubmissionById(
    articleSubmissions[1]._id
  );
  t.is(articleSubmission2.editor, editor.ethereumAddress);

  // Accept sanity check for article 1
  articleVersion1 = await articleVersionService.getArticleVersionById(
    author.ethereumAddress,
    articleVersion1._id
  );
  t.is(articleVersion1.articleVersionState, ArticleVersionState.SUBMITTED);
  await setSanityToOk(eurekaPlatformContract, articleVersion1.articleHash).send(
    {
      from: editor.ethereumAddress
    }
  );
  articleVersion1 = await articleVersionService.getArticleVersionById(
    author.ethereumAddress,
    articleVersion1._id
  );

  // Check for SC status change
  counter = 0;
  while (
    articleVersion1.articleVersionState !==
    ArticleVersionState.EDITOR_CHECKED &&
    counter < 10
  ) {
    sleepSync(5000);
    articleSubmissions = await articleSubmissionService.getAllSubmissions();
    counter++;
  }
  t.is(articleVersion1.articleVersionState, ArticleVersionState.EDITOR_CHECKED);

  // Decline sanity check for article 2
  articleVersion2 = await articleVersionService.getArticleVersionById(
    author.ethereumAddress,
    articleVersion2._id
  );
  t.is(articleVersion2.articleVersionState, ArticleVersionState.SUBMITTED);
  await setSanityIsNotOk(
    eurekaPlatformContract,
    articleVersion2.articleHash
  ).send({
    from: editor.ethereumAddress
  });
  articleVersion2 = await articleVersionService.getArticleVersionById(
    author.ethereumAddress,
    articleVersion2._id
  );

  // Check for SC status change
  counter = 0;
  while (
    articleVersion2.articleVersionState !==
    ArticleVersionState.DECLINED_SANITY_NOTOK &&
    counter < 10
  ) {
    sleepSync(5000);
    articleSubmissions = await articleSubmissionService.getAllSubmissions();
    counter++;
  }
  t.is(
    articleVersion2.articleVersionState,
    ArticleVersionState.DECLINED_SANITY_NOTOK
  );
});

/**************** Invite reviewers for review article & Reviewers accept Invitation  ******************/
test(
  PRETEXT +
  'Invite reviewers for review article & Reviewers accept Invitation ',
  async t => {
    // Create author and editor
    const author = await createUserContractOwner();
    const editor = await createEditor1();
    const reviewer1 = await createReviewer1();
    const reviewer2 = await createReviewer2();
    const reviewer3 = await createReviewer3();
    const reviewer4 = await createReviewer4();

    // Setup article draft 1 & 2
    await articleSubmissionService.createSubmission(author.ethereumAddress);
    let articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
    let articleVersion = articleSubmission.articleVersions[0];
    await articleVersionService.finishDraftById(
      author.ethereumAddress,
      articleVersion._id,
      TEST_ARTICLE_1_HASH_HEX
    );

    // Signup editor and submit article 1 & 2
    await signUpEditor(eurekaPlatformContract, editor.ethereumAddress).send({
      from: contractOwner
    });
    await submitArticle(
      eurekaTokenContract,
      eurekaPlatformContract.options.address,
      5000,
      TEST_ARTICLE_1_DATA_IN_HEX
    ).send({
      from: author.ethereumAddress,
      gas: 80000000
    });

    let counter = 0;
    while (
      typeof articleSubmission.scSubmissionID === 'undefined' &&
      counter < 10
    ) {
      sleepSync(5000);
      articleSubmission = (await articleSubmissionService.getAllSubmissions())[0];
      counter++;
    }

    // Assign editor for the submission process of article
    await assignForSubmissionProcess(
      eurekaPlatformContract,
      articleSubmission.scSubmissionID
    ).send({
      from: editor.ethereumAddress
    });

    // Accept sanity check for article 1
    articleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );
    await setSanityToOk(
      eurekaPlatformContract,
      articleVersion.articleHash
    ).send({
      from: editor.ethereumAddress
    });

    // Invite reviewers
    t.is(articleVersion.editorApprovedReviews.length, 0);
    await inviteReviewersForArticle(
      eurekaPlatformContract,
      articleVersion.articleHash,
      [
        reviewer1.ethereumAddress,
        reviewer2.ethereumAddress,
        reviewer4.ethereumAddress
      ]
    ).send({
      from: editor.ethereumAddress,
      gas: 80000000
    });

    articleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );

    // Check if article-version in DB holds reviewers
    counter = 0;
    while (articleVersion.editorApprovedReviews.length < 3 && counter < 10) {
      sleepSync(5000);
      articleVersion = await articleVersionService.getArticleVersionById(
        author.ethereumAddress,
        articleVersion._id
      );
      counter++;
    }
    t.is(articleVersion.editorApprovedReviews.length, 3);

    // Reviewer1 accept --> check for new state in DB
    await acceptReviewInvitation(
      eurekaPlatformContract,
      articleVersion.articleHash
    ).send({
      from: reviewer1.ethereumAddress,
      gas: 80000000
    });
    let review = await reviewService.getReviewById(
      reviewer1.ethereumAddress,
      articleVersion.editorApprovedReviews[0]
    );
    counter = 0;
    while (
      review.reviewState !== ReviewState.INVITATION_ACCEPTED &&
      counter < 10
    ) {
      sleepSync(5000);
      review = await reviewService.getReviewById(
        reviewer1.ethereumAddress,
        articleVersion.editorApprovedReviews[0]
      );
      counter++;
    }
    t.is(review.reviewState, ReviewState.INVITATION_ACCEPTED);

    // Reviewer2 accept --> check for new state in DB
    await acceptReviewInvitation(
      eurekaPlatformContract,
      articleVersion.articleHash
    ).send({
      from: reviewer2.ethereumAddress,
      gas: 80000000
    });
    let review2 = await reviewService.getReviewById(
      reviewer2.ethereumAddress,
      articleVersion.editorApprovedReviews[1]
    );
    counter = 0;
    while (
      review2.reviewState !== ReviewState.INVITATION_ACCEPTED &&
      counter < 10
    ) {
      sleepSync(5000);
      review2 = await reviewService.getReviewById(
        reviewer2.ethereumAddress,
        articleVersion.editorApprovedReviews[1]
      );
      counter++;
    }
    t.is(review2.reviewState, ReviewState.INVITATION_ACCEPTED);

    // Reviewer4 accept --> check for new state in DB
    await acceptReviewInvitation(
      eurekaPlatformContract,
      articleVersion.articleHash
    ).send({
      from: reviewer4.ethereumAddress,
      gas: 80000000
    });
    let review4 = await reviewService.getReviewById(
      reviewer4.ethereumAddress,
      articleVersion.editorApprovedReviews[2]
    );
    counter = 0;
    while (
      review4.reviewState !== ReviewState.INVITATION_ACCEPTED &&
      counter < 10) {
      sleepSync(5000);
      review4 = await reviewService.getReviewById(
        reviewer4.ethereumAddress,
        articleVersion.editorApprovedReviews[2]
      );
      counter++;
    }
    t.is(review4.reviewState, ReviewState.INVITATION_ACCEPTED);

    // Add editor-approved review1 into DB
    await reviewService.addEditorApprovedReview(
      reviewer1.ethereumAddress,
      review._id,
      REVIEW_1.reviewText,
      REVIEW_1_HASH_HEX,
      REVIEW_1.score1,
      REVIEW_1.score2,
      REVIEW_1.articleHasMajorIssues,
      REVIEW_1.articleHasMinorIssues
    );

    review = await reviewService.getReviewById(
      reviewer1.ethereumAddress,
      review._id
    );
    t.is(review.reviewState, ReviewState.HANDED_IN_DB);

    // Add review1 in SC
    await addEditorApprovedReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      REVIEW_1_HASH_HEX,
      REVIEW_1.articleHasMajorIssues,
      REVIEW_1.articleHasMinorIssues,
      REVIEW_1.score1,
      REVIEW_1.score2
    ).send({
      from: reviewer1.ethereumAddress,
      gas: 80000000
    });

    // Check if status changed on DB
    review = await reviewService.getReviewById(
      reviewer1.ethereumAddress,
      review._id
    );
    counter = 0;
    while (review.reviewState !== ReviewState.HANDED_IN_SC && counter < 10) {
      sleepSync(5000);
      review = await reviewService.getReviewById(
        reviewer1.ethereumAddress,
        review._id
      );
      counter++;
    }
    t.is(review.reviewState, ReviewState.HANDED_IN_SC);

    // Add editor-approved review2 into DB
    await reviewService.addEditorApprovedReview(
      reviewer2.ethereumAddress,
      review2._id,
      REVIEW_2.reviewText,
      REVIEW_2_HASH_HEX,
      REVIEW_2.score1,
      REVIEW_2.score2,
      REVIEW_2.articleHasMajorIssues,
      REVIEW_2.articleHasMinorIssues
    );

    review2 = await reviewService.getReviewById(
      reviewer2.ethereumAddress,
      review2._id
    );
    t.is(review2.reviewState, ReviewState.HANDED_IN_DB);

    // Add review2 in SC
    await addEditorApprovedReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      REVIEW_2_HASH_HEX,
      REVIEW_2.articleHasMajorIssues,
      REVIEW_2.articleHasMinorIssues,
      REVIEW_2.score1,
      REVIEW_2.score2
    ).send({
      from: reviewer2.ethereumAddress,
      gas: 80000000
    });

    // Check if status changed on DB
    review2 = await reviewService.getReviewById(
      reviewer2.ethereumAddress,
      review2._id
    );
    counter = 0;
    while (review2.reviewState !== ReviewState.HANDED_IN_SC && counter < 10) {
      sleepSync(5000);
      review2 = await reviewService.getReviewById(
        reviewer2.ethereumAddress,
        review2._id
      );
      counter++;
    }
    t.is(review2.reviewState, ReviewState.HANDED_IN_SC);

    // Write a community review as reviewer3
    t.is(articleVersion.communityReviews.length, 0);
    let review3 = await reviewService.addNewCommunitydReview(
      reviewer3.ethereumAddress,
      articleVersion.articleHash,
      REVIEW_3.reviewText,
      REVIEW_3_HASH_HEX,
      REVIEW_3.score1,
      REVIEW_3.score2,
      REVIEW_3.articleHasMajorIssues,
      REVIEW_3.articleHasMinorIssues
    );
    review3 = await reviewService.getReviewById(
      reviewer3.ethereumAddress,
      review3._id
    );
    articleVersion = await articleVersionService.getArticleVersionById(
      author.ethereumAddress,
      articleVersion._id
    );
    t.is(articleVersion.communityReviews.length, 1);

    t.is(review3.reviewState, ReviewState.HANDED_IN_DB);
    await addCommunityReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      REVIEW_3_HASH_HEX,
      REVIEW_3.articleHasMajorIssues,
      REVIEW_3.articleHasMinorIssues,
      REVIEW_3.score1,
      REVIEW_3.score2
    ).send({
      from: reviewer3.ethereumAddress,
      gas: 80000000
    });

    review3 = await reviewService.getReviewById(
      reviewer3.ethereumAddress,
      review3._id
    );

    counter = 0;
    while (review3.reviewState !== ReviewState.HANDED_IN_SC && counter < 10) {
      sleepSync(5000);
      review3 = await reviewService.getReviewById(
        reviewer3.ethereumAddress,
        review3._id
      );
      counter++;
    }
    t.is(review3.reviewState, ReviewState.HANDED_IN_SC);

    // Add editor-approved review4 into DB
    await reviewService.addEditorApprovedReview(
      reviewer4.ethereumAddress,
      review4._id,
      REVIEW_4.reviewText,
      REVIEW_4_HASH_HEX,
      REVIEW_4.score1,
      REVIEW_4.score2,
      REVIEW_4.articleHasMajorIssues,
      REVIEW_4.articleHasMinorIssues
    );

    // Add review4 in SC
    await addEditorApprovedReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      REVIEW_4_HASH_HEX,
      REVIEW_4.articleHasMajorIssues,
      REVIEW_4.articleHasMinorIssues,
      REVIEW_4.score1,
      REVIEW_4.score2
    ).send({
      from: reviewer4.ethereumAddress,
      gas: 80000000
    });

    // Check if status changed on DB
    review4 = await reviewService.getReviewById(
      reviewer4.ethereumAddress,
      review4._id
    );
    counter = 0;
    while (review4.reviewState !== ReviewState.HANDED_IN_SC && counter < 10) {
      sleepSync(5000);
      review4 = await reviewService.getReviewById(
        reviewer4.ethereumAddress,
        review4._id
      );
      counter++;
    }
    t.is(review4.reviewState, ReviewState.HANDED_IN_SC);

    // Accept review1
    await acceptReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      reviewer1.ethereumAddress
    ).send({
      from: editor.ethereumAddress
    });
    review = await reviewService.getReviewById(
      reviewer1.ethereumAddress,
      review._id
    );
    counter = 0;
    while (review.reviewState !== ReviewState.ACCEPTED && counter < 10) {
      sleepSync(5000);
      review = await reviewService.getReviewById(
        reviewer1.ethereumAddress,
        review._id
      );
      counter++;
    }
    t.is(review.reviewState, ReviewState.ACCEPTED);

    // Accept review4
    await acceptReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      reviewer4.ethereumAddress
    ).send({
      from: editor.ethereumAddress
    });
    review4 = await reviewService.getReviewById(
      reviewer4.ethereumAddress,
      review4._id
    );
    counter = 0;
    while (review4.reviewState !== ReviewState.ACCEPTED && counter < 10) {
      sleepSync(5000);
      review4 = await reviewService.getReviewById(
        reviewer4.ethereumAddress,
        review4._id
      );
      counter++;
    }
    t.is(review4.reviewState, ReviewState.ACCEPTED);

    // Decline review2
    await declineReview(
      eurekaPlatformContract,
      articleVersion.articleHash,
      reviewer2.ethereumAddress
    ).send({
      from: editor.ethereumAddress
    });
    review2 = await reviewService.getReviewById(
      reviewer2.ethereumAddress,
      review2._id
    );
    counter = 0;
    while (review2.reviewState !== ReviewState.DECLINED && counter < 10) {
      sleepSync(5000);
      review2 = await reviewService.getReviewById(
        reviewer2.ethereumAddress,
        review2._id
      );
      counter++;
    }
    t.is(review2.reviewState, ReviewState.DECLINED);

    // Editor accepts articleVersion
    await acceptArticleVersion(
      eurekaPlatformContract,
      articleVersion.articleHash
    ).send({
      from: editor.ethereumAddress
    });
    articleVersion = await articleVersionService.getArticleVersionById(author.ethereumAddress, articleVersion._id);
    t.is(articleVersion.articleVersionState, ArticleVersionState.ACCEPTED);
  }
);
