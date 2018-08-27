import userService from '../db/user-service.mjs';
import articleSubmissionService from '../db/article-submission-service.mjs';
import articleVersionService from '../db/article-version-service.mjs';
import reviewService from '../db/review-service.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import ArticleVersionState from '../schema/article-version-state-enum.mjs';
import ReviewState from '../schema/review-state-enum.mjs';
import Review from '../schema/review.mjs';
import ArticleVersion from '../schema/article-version.mjs';

export default {
  setup: EurekaPlatformContract => {

    /** Editor Sign up **/
    EurekaPlatformContract.events.EditorSignUp(undefined, async (error, event) => {
      if (error) throw error;
      await userService.makeEditor(event.returnValues.editorAddress);
    });

    /** Submission Process Start **/
    EurekaPlatformContract.events.SubmissionProcessStart(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await articleSubmissionService.updateSubmissionStartByArticleHash(
          event.returnValues.submissionId,
          event.returnValues.articleHash,
          event.returnValues.articleURL
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
          event.returnValues.assignerAddress
        );
      }
    );

    /** Remove editor from submission process **/
    EurekaPlatformContract.events.RemovedEditorFromSubmission(
      undefined,
      async (error, event) => {
        if (error) throw error;

        await articleSubmissionService.removeEditorFromSubmission(
          event.returnValues.submissionId
        );
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
          ArticleVersionState.EDITOR_CHECKED
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

    /** Reviewers are assigned as editor-approved on an article **/
    EurekaPlatformContract.events.ReviewersAreInvited(
      undefined,
      async (error, event) => {
        if (error) throw error;

        const approvedReviewers = event.returnValues.editorApprovedReviewers;
        const articleHash = event.returnValues.articleHash;
        const timestamp = event.returnValues.stateTimestamp;

        await articleVersionService.changeArticleVersionState(
          event.returnValues.articleHash,
          ArticleVersionState.REVIEWERS_INVITED
        );

        let articleVersion = await ArticleVersion.findOne({
          articleHash: articleHash
        });
        if (!articleVersion) errorThrower.noEntryFoundById(articleHash);


        for (let i = 0; i < approvedReviewers.length; i++) {
          const review = new Review({
            stateTimestamp: timestamp,
            reviewerAddress: approvedReviewers[i]
          });
          await review.save();
          articleVersion.editorApprovedReviews.push(review._id);
        }
        await articleVersion.save();

      }
    );

    EurekaPlatformContract.events.InvitationIsAccepted(
      undefined,
      async (error, event) => {
        if (error) throw error;

        const articleHash = event.returnValues.articleHash;
        const reviewerAddress = event.returnValues.reviewerAddress;

        let articleVersion = await ArticleVersion.findOne({
          articleHash: articleHash
        }).populate('editorApprovedReviews');
        if (!articleVersion) errorThrower.noEntryFoundById(articleHash);

        let articleReviews = articleVersion.editorApprovedReviews;
        for (let i = 0; i < articleReviews.length; i++) {
          if (articleReviews[i].reviewerAddress == reviewerAddress) {
            articleReviews[i].stateTimestamp = event.returnValues.stateTimestamp;
            articleReviews[i].reviewState = ReviewState.INVITATION_ACCEPTED;
            await articleReviews[i].save();
            break;
          }
          if (i === articleReviews.length - 1) {
            let error = new Error('Invitation Acception: corresponding review could not be found');
            error.status = 500;
            throw error;
          }
        }
      }
    );

    EurekaPlatformContract.events.EditorApprovedReviewIsAdded(
      undefined,
      async (error, event) => {
        if (error) throw error;
        await reviewService.updateEditorApprovedReviewFromSC(
          event.returnValues.reviewHash,
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
          event.returnValues.reviewHash,
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

        console.log('ACCEPTION WORKED');
      }
    );
  }
};
