import bcryptHasher from '../helpers/bcrypt-hasher.mjs';
import User from '../schema/user.mjs';
import Roles from '../schema/roles-enum.mjs';
import ArticleSubmission from '../schema/article-submission.mjs';
import {isValidAddress} from '../../helpers/isValidEthereumAddress.mjs';
import userService from '../db/user-service.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

export default {
  /**
   * get all existing users from the DB
   * @returns {*}
   */
  getAllUsers: () => {
    return User.find({});
  },
  /**
   * create a new user in the DB
   * @param password
   * @param email
   * @returns {Promise<Model>}
   */
  createUser: async (password, email, ethereumAddress, avatar) => {
    let user = await userService.getUserByEthereumAddress(ethereumAddress);
    if (user) {
      let error = new Error(
        'User with address ' + ethereumAddress + ' already exists.'
      );
      error.status = 409;
      throw error;
    }

    if (!password || !email || !ethereumAddress) {
      let error = new Error('Password, Email or Address is missing!');
      error.status = 400;
      throw error;
    }

    if (!isValidAddress(ethereumAddress)) {
      let error = new Error(
        'Checks sum for the address ' + ethereumAddress + ' failed.'
      );
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcryptHasher.hash(password);

    const newUser = new User({
      ethereumAddress,
      password: hashedPassword,
      email,
      avatar,
      isEditor: false //default not an editor
    });

    return newUser.save().then(
      function() {
        return newUser;
      },
      function(err) {
        console.log('Error :' + err);
        let error = new Error('Something went wrong: ' + err);
        error.status = 500;
        throw error;
      }
    );
  },
  /**
   * Get one user by ethereumAddress
   * @param ethereumAddress
   * @returns {Promise<Query|void|*|Promise<Object>|Promise<TSchema | null>|Promise>}
   */
  getUserByEthereumAddress: async ethereumAddress => {
    return User.findOne({ethereumAddress: ethereumAddress});
  },

  /**
   * Get one user by the ID
   * @param userId
   * @returns {Promise<Query|void|*|ThenPromise<Object>|Promise<TSchema | null>|Promise>}
   */
  getUserById: async userId => {
    return User.findOne({_id: userId});
  },

  /**
   * Add the role to the given user
   * if the role matches a roles-enum
   * @param user_id
   * @param role
   * @returns {Promise<void>}
   */
  addRole: async (user_id, role) => {
    if (Roles.hasOwnProperty(role)) {
      return User.findByIdAndUpdate(
        user_id,
        {
          $addToSet: {
            roles: role
          }
        },
        function(err, user) {
          if (err) throw err;
          console.log(
            'User ' + user_id + ' was granted the role "' + role + '"'
          );
          return user;
        }
      );
    } else {
      throw new Error('No matching role found in DB');
    }
  },

  makeEditor: async ethereumAddress => {
    User.findOneAndUpdate(
      {ethereumAddress: ethereumAddress},
      {
        isEditor: true
      },
      (err, user) => {
        if (err) throw err;
        console.log('User ' + user.ethereumAddress + ' has become an Editor');
        return user;
      }
    );
  },

  /**
   * Pushes an submission to the User's submissions. User is given by the etherumaddress
   * @param ethereumAddress
   * @param submissionId
   * @returns {Promise<void>}
   */
  addArticleSubmission: async (ethereumAddress, submissionId) => {
    let articleSubmission = await ArticleSubmission.findById(submissionId);
    if (!articleSubmission) {
      let error = new Error('ArticleSubmission could not be found in DB');
      error.status = 400;
      throw error;
    }

    User.findOneAndUpdate(
      {ethereumAddress: ethereumAddress},
      {$push: {articleSubmissions: articleSubmission}},
      (err, user) => {
        if (err) {
          let error = new Error(
            'Could not update user ' + ethereumAddress + ': ' + err
          );
          error.status = 400;
          throw error;
        } else {
          console.log(
            'User ' +
            user.ethereumAddress +
            ' got the submission with ID: ' +
            articleSubmission._id
          );
          return user;
        }
      }
    );
  },

  /**
   * Adds a reviewerInvitation to the array of reviewerInvitation
   * @param ethereumAddress
   * @param review
   * @returns {Promise<void>}
   */
  addReviewInvitation: async (ethereumAddress, review) => {
    let user = await User.find({ethereumAddress: ethereumAddress});
    if (!user) errorThrower.noEntryFoundById(ethereumAddress);

    user.reviewerInvitation.push(review);
    User.findOneAndUpdate(
      {ethereumAddress: ethereumAddress},
      user
    );
  }
};
