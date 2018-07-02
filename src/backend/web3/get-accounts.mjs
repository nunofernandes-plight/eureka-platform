import web3 from './web3Instance.mjs';

const getAccounts = async () => {
  return web3.eth
    .getAccounts()
    .then(accounts => {
      return accounts;
    })
    .catch(err => console.log(err));
};

export default getAccounts;
