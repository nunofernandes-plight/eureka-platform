import mongoose from './mongoose-db';
import db from './db';
import submissionSchema from '../schema/submission';

const collectionName = 'submissions';
const Submission = mongoose.model(collectionName, submissionSchema, collectionName);

export default {
  getAllSubmission: () => {
    return db
      .collection(collectionName)
      .find()
      .toArray();
  },
  createSubmission: (ownerAddress) => {
    const submission = new Submission({ownerAddress: ownerAddress});
    return submission.save(function(err) {
      if (err) return console.error(err);
      console.log('Created new Submission on DB done');
    });
  }
};