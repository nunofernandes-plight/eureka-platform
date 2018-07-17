import mongoose from "mongoose";

/**
 * Different roles a platform user can have --> access authorization is based on it.
 */
const roleSchema =  mongoose.Schema(
  {
    value : {
      type: String,
      enum: ['ADMIN', 'EDITOR', 'REVIEWER', 'GUEST']
    },
    _id: false
  }
);

export default roleSchema;