import userService from '../db/user-service';

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
        //TODO save submission in DB
        console.log(
          'Backend - Submission here: ' + event.returnValues.submissionOwner
        );
      }
    );
  }
};
