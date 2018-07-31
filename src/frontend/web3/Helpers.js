export const getAccounts = async web3 => {
  if (web3) {
    return web3.eth
      .getAccounts()
      .then(accounts => {
        return accounts;
      })
      .catch(err => {
        console.error('An error with getAccounts() occurred: ' + err);
        return null;
      });
  }
};

export const getBalance = async (web3, address) => {
  if (web3) {
    return web3.eth
      .getBalance(address)
      .then(balance => {
        return balance;
      })
      .catch(err =>
        console.error('An error with getBalance() occurred: ' + err)
      );
  }
};
