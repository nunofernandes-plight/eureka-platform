import userService from '../../src/backend/db/user-service.mjs';
import User from '../../src/backend/schema/user.mjs';
import web3 from '../../src/helpers/web3Instance.mjs';
import getAccounts from '../../src/smartcontracts/methods/get-accounts.mjs';
import {getRandomAvatar} from '../../src/frontend/helpers/getRandomAvatar.mjs';
import Roles from '../../src/backend/schema/roles-enum.mjs';

const getEmails = () => {
  return [
    'lucas@sciencematters.io',
    'severin@sciencematters.io',
    'andrew@sciencematters.io',
    'isabelle@sciencematters.io',
    'lawrence@sciencematters.io',
    'werner@sciencematters.io',
    'amani@sciencematters.io',
    'andreas@sciencematters.io',
    'tom@sciencematters.io',
    'jonny@sciencematters.io'
  ];
};

const getFakePsw = () => {
  return '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c';
};

export const createDifferentUsers = async () => {
  const accounts = await getAccounts(web3);

  const users = await Promise.all(
    getEmails().map(async (email, i) => {
      const user = await userService.getUserByEthereumAddress(accounts[i]);
      if (!user) {
        const newUser = await userService.createUser(
          getFakePsw(),
          email,
          accounts[i],
          'img/icons/avatars/' + getRandomAvatar()
        );
        newUser.roles.push(Roles.REVIEWER);
        newUser.save();
      }
      return user;
    })
  );
};
