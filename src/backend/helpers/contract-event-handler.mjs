import userService from '../db/user-service.mjs';
import articleSubmissionService from '../db/article-submission-service.mjs';

export default {
  setup: EurekaPlatformContract => {
    //sign in for events
    EurekaPlatformContract.events.EditorSignUp(undefined, (error, event) => {
      if (error) throw error;
      userService.makeEditor(event.returnValues.editorAddress);
    });

    EurekaPlatformContract.events.SubmissionProcessStart(
      undefined,
      (error, event) => {
        if (error) throw error;
        articleSubmissionService.createSubmission(
          event.returnValues.submissionId, event.returnValues.submissionOwner);
      }
    );
  }
};
