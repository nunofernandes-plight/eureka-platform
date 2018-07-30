import bcryptHasher from '../helpers/bcrypt-hasher.mjs';
import User from '../schema/user.mjs';
import Roles from '../schema/roles-enum.mjs';

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
   * @param username
   * @param password
   * @param email
   * @returns {Promise<Model>}
   */
  createUser: async (username, password, email, ethereumAddress) => {
    const hashedPassword = await bcryptHasher.hash(password);
    const newUser = new User({
      username: username,
      ethereumAddress: ethereumAddress,
      password: hashedPassword,
      email: email,
      isEditor: false //default not an editor
    });

    return newUser.save().then(
      function() {
        return newUser;
      },
      function(err) {
        console.log('Error :' + err);
        throw err;
      }
    );
  },

  /**
   * Get one user by ethereumAddress
   * @param ethereumAddress
   * @returns {Promise<Query|void|*|Promise<Object>|Promise<TSchema | null>|Promise>}
   */
  getUserByEthereumAddress: async (ethereumAddress) => {
    return User.findOne({'ethereumAddress': ethereumAddress});
  },

  /**
   * Get one user by the ID
   * @param userId
   * @returns {Promise<Query|void|*|ThenPromise<Object>|Promise<TSchema | null>|Promise>}
   */
  getUserById: async (userId) => {
    return User.findOne({'_id': userId});
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
        console.log('User with' + user._id + ' has become an Editor');
        return user;
      }
    );
  }
};
