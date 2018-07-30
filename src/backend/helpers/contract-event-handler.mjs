import userService from '../db/user-service.mjs';
import submissionService from '../db/submission-service.mjs';

export default {
  setup: EurekaPlatformContract => {
    //sign in for events
    EurekaPlatformContract.events.EditorSignUp(undefined, (error, event) => {
      if (error) throw error;
      userService.makeEditor(event.returnValues.editorAdress);
    });

    EurekaPlatformContract.events.SubmissionProcessStart(
      undefined,
      (error, event) => {
        if (error) throw error;
        submissionService.createSubmission(event.returnValues.submissionOwner);
      }
    );
  }
};
