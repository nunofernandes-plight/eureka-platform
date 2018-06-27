import web3 from './init';

const getAccounts = async () => {
  return web3.eth
    .getAccounts()
    .then(accounts => {
      return accounts;
    })
    .catch(err => console.log(err));
};

export default getAccounts;
