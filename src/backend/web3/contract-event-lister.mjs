import userService from '../db/user-service.mjs';
import articleSubmissionService from '../db/article-submission-service.mjs';
import articleVersionService from '../db/article-version-service.mjs';
import scTransactionService from '../db/sc-transaction-service.mjs';
import reviewService from '../db/review-service.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import ArticleVersionState from '../schema/article-version-state-enum.mjs';
import ArticleSubmissionState from '../schema/article-submission-state-enum.mjs';
import ScTransactionType from '../schema/sc-transaction-state-enum.mjs';
import ReviewState from '../schema/review-state-enum.mjs';
import ReviewType from '../schema/review-type-enum.mjs';
import Review from '../schema/review.mjs';
import ArticleVersion from '../schema/article-version.mjs';
import {sendEmail} from '../email/index.mjs';
import {getReviewersInvitationTemplate} from '../email/templates/EmailTemplates.mjs';
import {sendEmailByEthereumAddress} from '../email/index';
import {getEditorResignedInvitationTemplate} from '../email/templates/EmailTemplates';


export default {
  setup: EurekaPlatformContract => {
    /** Editor Sign up **/
    EurekaPlatformContract.events.EditorSignUp(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await userService.makeEditor(event.returnValues.editorAddress);

        const additionalInfo = {
          affectedAddress: event.returnValues.editorAddress
        };
        await scTransactionService.createScTransaction(
          event.returnValues.submissionOwner,
          ScTransactionType.EDITOR_ASSIGNED,
          event.returnValues.stateTimestamp,
          event.transactionHash,
          additionalInfo
        );
      }
    );

    /** Expert Reviewer Sign up **/
    EurekaPlatformContract.events.ExpertReviewerSignUp(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await userService.makeExpertReviewer(event.returnValues.reviewerAddress);

        const additionalInfo = {
          affectedAddress: event.returnValues.reviewerAddress
        };
        await scTransactionService.createScTransaction(
          event.returnValues.contractOwner,
          ScTransactionType.EXPERT_REVIEWER_SIGNEDUP,
          event.returnValues.stateTimestamp,
          event.transactionHash,
          additionalInfo
        );
      }
    );

    /** Submission Process Start **/
    EurekaPlatformContract.events.SubmissionProcessStart(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await articleSubmissionService.updateSubmissionStartByArticleHash(
          event.returnValues.submissionId,
          event.returnValues.articleHash,
          event.returnValues.articleURL,
          event.returnValues.stateTimestamp,
        );

        const additionalInfo = {
          articleHash: event.returnValues.articleHash,
          articleURL: event.returnValues.articleURL
        };
        await scTransactionService.createScTransaction(
          event.returnValues.submissionOwner,
          ScTransactionType.SUBMIT_ARTICLE,
          event.returnValues.stateTimestamp,
          event.transactionHash,
          additionalInfo
        );
      }
    );

    /** Assignement for Submission process **/
    EurekaPlatformContract.events.AssignmentForSubmissionProcess(
      undefined,
      (error, event) => {
        if (error) throw error;

        articleSubmissionService.updateEditorToSubmission(
          event.returnValues.submissionId,
          event.returnValues.assignerAddress,
          event.returnValues.stateTimestamp
        );

      }
    );

    /** Remove editor from submission process **/
    EurekaPlatformContract.events.RemovedEditorFromSubmission(
      undefined,
      async (error, event) => {
        if (error) throw error;

        const oldEditorAddress = await articleSubmissionService.removeEditorFromSubmission(
          event.returnValues.submissionId
        );


        sendEmailByEthereumAddress({
          ethereumAddress: oldEditorAddress,
          from: 'info@eurekatoken.io',
          subject: 'Editor Resignation',
          html: getEditorResignedInvitationTemplate()
        });
      }
    );

    /** Change editor from submission process **/
    EurekaPlatformContract.events.ChangedEditorFromSubmission(
      undefined,
      async (error, event) => {
        if (error) throw error;

        await articleSubmissionService.updateEditorToSubmission(
          event.returnValues.submissionId,
          event.returnValues.newEditor
        );
      }
    );

    /** SanityCheck got accepted from an Editor on an article version **/
    EurekaPlatformContract.events.SanityIsOk(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await articleVersionService.changeArticleVersionState(
          event.returnValues.articleHash,
          ArticleVersionState.OPEN_FOR_ALL_REVIEWERS
        );
      }
    );

    /** SanityCheck got declined from an Editor on an article version **/
    EurekaPlatformContract.events.SanityIsNotOk(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await articleVersionService.changeArticleVersionState(
          event.returnValues.articleHash,
          ArticleVersionState.DECLINED_SANITY_NOTOK
        );
      }
    );

    EurekaPlatformContract.events.SignedUpForReviewing(
      undefined,
      async (error, event) => {
        if (error) throw error;

        let reviewType;
        if (event.returnValues.isEditorApprovedReview)
          reviewType = ReviewType.EDITOR_APPROVED_REVIEW;
        else
          reviewType = ReviewType.COMMUNITY_REVIEW;

        const review = await reviewService.signUpForReviewing(
          event.returnValues.reviewerAddress,
          event.returnValues.articleHash,
          reviewType,
          event.returnValues.stateTimestamp,);

        await articleVersionService.addReview(event.returnValues.articleHash, review);
      }
    );

    EurekaPlatformContract.events.ResignedFromReviewing(
      undefined,
      async (error, event) => {
        if (error) throw error;

        const articleVersionId =
          (await articleVersionService
            .getArticleVersionByArticleHash(event.returnValues.articleHash))._id;

        console.log('ARTICLEVERSION_ID : ' + articleVersionId);
        await reviewService.resignReview(event.returnValues.reviewerAddress, articleVersionId);
      }
    );

    EurekaPlatformContract.events.EditorApprovedReviewIsAdded(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await reviewService.updateEditorApprovedReviewFromSC(
          event.returnValues.articleHash,
          event.returnValues.reviewHash,
          event.returnValues.reviewerAddress,
          event.returnValues.stateTimestamp,
          event.returnValues.articleHasMajorIssues,
          event.returnValues.articleHasMinorIssues,
          event.returnValues.score1,
          event.returnValues.score2
        );
      }
    );

    EurekaPlatformContract.events.CommunityReviewIsAdded(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await reviewService.updateCommunityReviewFromSC(
          event.returnValues.articleHash,
          event.returnValues.reviewHash,
          event.returnValues.reviewerAddress,
          event.returnValues.stateTimestamp,
          event.returnValues.articleHasMajorIssues,
          event.returnValues.articleHasMinorIssues,
          event.returnValues.score1,
          event.returnValues.score2
        );
      }
    );

    EurekaPlatformContract.events.ReviewIsAccepted(
      undefined,
      async (error, event) => {
        if (error) throw error;

        await reviewService.acceptReview(
          event.returnValues.articleHash,
          event.returnValues.reviewer,
          event.returnValues.stateTimestamp
        );
      }
    );

    EurekaPlatformContract.events.ReviewIsDeclined(
      undefined,
      async (error, event) => {
        if (error) throw error;

        await reviewService.declineReview(
          event.returnValues.articleHash,
          event.returnValues.reviewer,
          event.returnValues.stateTimestamp
        );
      }
    );

    EurekaPlatformContract.events.ReviewIsCorrected(
      undefined,
      async (error, event) => {
        if (error) throw error;

        console.log(await reviewService.updateReviewByReviewHash(
          event.returnValues.oldReviewHash,
          event.returnValues.reviewHash,
          event.returnValues.stateTimestamp,
          event.returnValues.articleHasMajorIssues,
          event.returnValues.articleHasMinorIssues,
          event.returnValues.score1,
          event.returnValues.score2,
        ));
      }
    );

    EurekaPlatformContract.events.ArticleVersionIsAccepted(
      undefined,
      async (error, event) => {
        if (error) throw error;

        await articleVersionService.changeArticleVersionState(
          event.returnValues.articleHash,
          ArticleVersionState.ACCEPTED
        );
      }
    );

    EurekaPlatformContract.events.DeclineArticleVersion(
      undefined,
      async (error, event) => {
        if (error) throw error;

        await articleVersionService.changeArticleVersionState(
          event.returnValues.articleHash,
          ArticleVersionState.DECLINED
        );
      }
    );

    EurekaPlatformContract.events.NewReviewRoundOpened(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await articleSubmissionService.submitArticleVersion(event.returnValues.submissionId,
          event.returnValues.articleHash, event.returnValues.articleUrl);

        await articleSubmissionService.updateAritcleSubmissionState(event.returnValues.submissionId, ArticleSubmissionState.OPEN);
      }
    );

    EurekaPlatformContract.events.NewReviewRoundDeclined(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await articleSubmissionService.closeArticleSubmission(event.returnValues.submissionId);
      }
    );

    EurekaPlatformContract.events.NewReviewRoundRequested(
      undefined,
      async (error, event) => {
        if (error) throw error;

        await articleSubmissionService.updateAritcleSubmissionState(event.returnValues.submissionId, ArticleSubmissionState.NEW_REVIEW_ROUND_REQUESTED);
      }
    );

    EurekaPlatformContract.events.SubmissionProcessClosed(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await articleSubmissionService.updateAritcleSubmissionState(event.returnValues.submissionId, ArticleSubmissionState.CLOSED);
      }
    );
  }
}
;
