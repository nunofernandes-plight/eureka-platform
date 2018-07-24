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

export default submissionSchema;