import userService from '../db/user-service.mjs';
import articleSubmissionService from '../db/article-submission-service.mjs';

export default {
  setup: EurekaPlatformContract => {

    /** Editor Sign up **/
    EurekaPlatformContract.events.EditorSignUp(undefined, (error, event) => {
      if (error) throw error;
      userService.makeEditor(event.returnValues.editorAddress);
    });

    /** Submission Process Start **/
    EurekaPlatformContract.events.SubmissionProcessStart(
      undefined,
      (error, event) => {
        if (error) throw error;
        articleSubmissionService.createSubmission(
          event.returnValues.submissionId, event.returnValues.submissionOwner);
      }
    );

    // /** Article version submitted**/
    // EurekaPlatformContract.events.ArticleVersionSubmitted(undefined, (error, event) => {
    //   if(error) throw error;
    //
    // })
  }
};
