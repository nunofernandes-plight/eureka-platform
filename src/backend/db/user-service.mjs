import bcryptHasher from '../helpers/bcrypt-hasher.mjs';
import User from '../schema/user.mjs';
import Roles from '../schema/roles-enum.mjs';
import ArticleSubmission from '../schema/article-submission.mjs';
import {isValidAddress} from '../../helpers/isValidEthereumAddress.mjs';
import userService from '../db/user-service.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import ContractOwner from '../schema/contract-owner.mjs';
import addressBookService from './address-book-service.mjs';

export default {
  /**
   * get all existing users from the DB
   * @returns {*}
   */
  getAllUsers: () => {
    return User.find({});
  },

  getAllUsersByRole: async role => {
    return await User.find({roles: role});
  },

  getUsersAddressByEmailQueryandRole: async (queryParam, roles) => {
    roles.map(role => {
      if (!Roles.hasOwnProperty(role)) {
        return new Error(role + ' is not a valid role');
      }
    });
    const regexQuery = '.*' + queryParam + '.*';
    const users = await User.find({
      email: {$regex: regexQuery, $options: 'i'},
      roles: {$in: roles}
    });
    //const users = await User.find({'email': 'test@test.ch'});
    if (!users) errorThrower.noEntryFoundById(regexQuery);

    let usersData = [];
    users.map(user => {
      let userData = {};
      userData.email = user.email;
      userData.ethereumAddress = user.ethereumAddress;
      userData.avatar = user.avatar;
      usersData.push(userData);
    });
    return usersData;
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
      avatar
    });

    const contractOwner = await ContractOwner.findById(1);

    // add default roles
    /*
    newUser.roles.push(Roles.REVIEWER);*/
    if (contractOwner.address === ethereumAddress) {
      newUser.roles.push(Roles.CONTRACT_OWNER);
    }

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
   * Get one user by ethereumAddress and populate by scTransactions
   * @param ethereumAddress
   * @returns {Promise<Query|void|*|Promise<Object>|Promise<TSchema | null>|Promise>}
   */
  getUserByEthereumAddressWithScTransactions: async ethereumAddress => {
    return User.findOne({ethereumAddress: ethereumAddress}).populate(
      'scTransactions'
    );
  },

  /**
   * Get one user by the ID
   * @param userId
   * @returns {Promise<Query|void|*|ThenPromise<Object>|Promise<TSchema | null>|Promise>}
   */
  getUserById: async userId => {
    return User.findOne({_id: userId});
  },

  getOwnRoles: async ethereumAddress => {
    if (!ethereumAddress) errorThrower.missingParameter('Ethereum-address');

    const user = await User.findOne({ethereumAddress: ethereumAddress});
    if (!user) errorThrower.noEntryFoundById(ethereumAddress);

    return user.roles;
  },

  getOwnScTransactions: async ethereumAddress => {
    if (!ethereumAddress) errorThrower.missingParameter('Ethereum-address');
    const user = await User.findOne({
      ethereumAddress: ethereumAddress
    }).populate('scTransactions');
    if (!user) errorThrower.noEntryFoundById(ethereumAddress);
    return user.scTransactions;
  },

  /**
   * Add the role to the given user
   * if the role matches a roles-enum
   * @param user_id
   * @param role
   * @returns {Promise<void>}
   */
  addRole: async (userAddress, role) => {
    if (Roles.hasOwnProperty(role)) {
      return await User.findOneAndUpdate(
        {ethereumAddress: userAddress},
        {
          $addToSet: {
            roles: role
          }
        },
        function(err, user) {
          if (err) throw err;
          return user;
        }
      );
    }
    errorThrower.notExistingRole(role);
  },
  /**
   * Remove role from the given user
   * @param ethereumAddress
   * @returns {Promise<void>}
   */
  removeRole: async (userAddress, role) => {
    if (Roles.hasOwnProperty(role)) {
      let user = await User.findOne({ethereumAddress: userAddress});
      if (!user) errorThrower.noEntryFoundById(userAddress);
      user.roles.pull(role);
      return await user.save();
    }
    errorThrower.notExistingRole(role);
  },

  becomeReviewer: async userAddress => {
    let user = await User.findOne({ethereumAddress: userAddress});
    if (!user) errorThrower.notCorrectEthereumAddress(userAddress);
    if (!user.roles.includes(Roles.REVIEWER)) user.roles.push(Roles.REVIEWER);
    return await user.save();
  },

  makeEditor: async ethereumAddress => {
    let user = await User.findOne({ethereumAddress: ethereumAddress});
    if (!user) {
      errorThrower.noEntryFoundById(ethereumAddress);
    }

    if (!user.roles.includes(Roles.EDITOR)) {
      user.roles.push(Roles.EDITOR);
    }

    await user.save();
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
  }

  /*
    Pushes an address book entry to the users address book

    ERROR HANDLING TO COMPLEX -> WHAT IF FIRST CALL SUCCEEDS BUT SECOND FAILS,
    CONTACT NEED TO BE REMOVED AGAIN
   */
  // addAddressBookContact: (addressBookOwnerAddress,
  //                               {
  //                                 contactAddress,
  //                                 preName,
  //                                 lastName,
  //                                 label
  //                               }) => {
  //
  //   addressBookService.createContact(addressBookOwnerAddress,
  //     {
  //       contactAddress,
  //       preName,
  //       lastName,
  //       label
  //     })
  //     .then((contact) => {
  //
  //       User.findOneAndUpdate(
  //         {ethereumAddress: addressBookOwnerAddress},
  //         {$push: {addressBook: contact._id}},
  //         (err, user) => {
  //           if (err) {
  //             let error = new Error(
  //               'Could not update user ' + addressBookOwnerAddress + ': ' + err
  //             );
  //             error.status = 400;
  //             throw error;
  //           } else {
  //             console.log(
  //               'A new Contact with the address ' + contact.contactAddress
  //               + ' was added to the user with the address ' + addressBookOwnerAddress
  //             );
  //             return user;
  //           }
  //         }
  //       );
  //
  //     });
  // }
};
