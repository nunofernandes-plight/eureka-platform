import mongoose from 'mongoose';

/**
 * Submission for an article on the eureka platform
 */
const submissionSchema = mongoose.Schema(
  {
    ownerAddress: {
      type: String,
      required: true
    },
  },
  {collection: 'submissions'}
);

const Submission = mongoose.model('Submission', submissionSchema, 'submissions');
export default Submission;