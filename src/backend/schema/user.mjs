import mongoose from 'mongoose';
import {articleSubmissionSchema} from './article-submission.mjs';
import Roles from './roles-enum.mjs';

/**
 * User of the eureka platform
 * Model is used for the local user authentication with passport
 */
const userSchema = mongoose.Schema(
  {
    ethereumAddress: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      unique: false
    },
    email: {
      type: String,
      required: true,
      unique: false
    },
    avatar: {
      type: String,
      required: true,
      unique: false
    },
    isEditor: {
      type: Boolean
    },
    roles: [
      {
        type: String,
        enum: Object.values(Roles)
      }
    ],
    articleSubmissions: [articleSubmissionSchema]
  },
  {collection: 'users'}
);

const User = mongoose.model('User', userSchema, 'users');

export default User;
