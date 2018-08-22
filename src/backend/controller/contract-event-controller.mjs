import userService from '../db/user-service.mjs';
import articleSubmissionService from '../db/article-submission-service.mjs';
import articleVersionService from '../db/article-version-service.mjs';
import reviewService from '../db/review-service.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import ArticleVersionState from '../schema/article-version-state-enum.mjs';
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
        const submissionId = event.returnValues.submissionId;
        const articleHash = event.returnValues.articleHash;
        const timestamp = event.returnValues.stateTimestamp;

        await articleVersionService.changeArticleVersionState(
          event.returnValues.articleHash,
          ArticleVersionState.REVIEWERS_INVITED
        );

        let articleVersion = await ArticleVersion.findOne({
          articleHash: articleHash
        });
        if(!articleVersion) errorThrower.noEntryFoundById(articleHash);


        for(let i = 0; i < approvedReviewers.length; i++) {
          const review = new Review({
            stateTimestamp: timestamp,
            reviewerAddress: approvedReviewers[i]
          });
          articleVersion.reviews.push(review);
        }
        await articleVersion.save();

        // const reviews = await createReviews(approvedReviewers, submissionId, articleHash, timestamp);
        // reviews.forEach(review => {
        //   userService.addReviewInvitation(review.reviewerAddress, review);
        // });
      }
    );
    //
    // /** Acception of Reviewer Invitation**/
    // EurekaPlatformContract.events.InvitationIsAccepted(
    //   undefined,
    //   async (error, event) => {
    //     if (error) throw error;
    //
    //     // TODO: update review state to invitation_accepted & stateTimestamp
    //     // TODO update submission/article-version/
    //     // TODO
    //     console.log('INVITATION ACCEPTED on' +
    //       event.returnValues.articleHash +
    //       ' by ' +
    //       event.returnValues.reviewerAddress
    //     );
    //   }
    // );
  }
};

// async function createReviews(approvedReviewers, submissionId, articleHash, timestamp) {
//   let reviews = [];
//
//   for (const approvedReviewer of approvedReviewers) {
//     const review = await createReview(approvedReviewer, submissionId, articleHash, timestamp);
//     reviews.push(review);
//   }
//   return reviews;
// }
//
// async function createReview(reviewerAddress, submissionId, articleHash, timestamp) {
//   let review = await reviewService.createReviewAndReturn(submissionId, articleHash, timestamp, reviewerAddress);
//   await articleSubmissionService.pushReviewIntoArticleVersion(submissionId, articleHash, review);
//   return review;
// }
