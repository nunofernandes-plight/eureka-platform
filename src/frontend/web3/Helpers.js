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

export const getAllAccounts = async web3 => {
  let accounts = new Map();
  if (web3) {
    return web3.eth
      .getAccounts()
      .then(async addresses => {
        await Promise.all(
          addresses.map(async address => {
            const balance = await getBalance(web3, address);
            const ethBalance = web3.utils.fromWei(balance.toString());
            accounts.set(address, ethBalance);
          })
        );
        return accounts;
      })
      .catch(err => {
        console.error('An error with getAccounts() occurred: ' + err);
        return null;
      });
  }
};
